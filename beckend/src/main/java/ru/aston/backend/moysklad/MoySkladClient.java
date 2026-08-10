package ru.aston.backend.moysklad;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;

/** Thin wrapper over МойСклад's JSON API v1.2 (https://api.moysklad.ru/api/remap/1.2) —
 * only the two read endpoints this sync needs: the product catalog and the current stock report. */
@Component
@Slf4j
public class MoySkladClient {

    private static final int PAGE_LIMIT = 1000;
    private static final String SALE_PRICE_TYPE = "Цена Розничная";
    private static final Pattern PRODUCT_ID_IN_HREF = Pattern.compile("/entity/product/([0-9a-fA-F-]+)");

    private final RestClient restClient;

    public MoySkladClient(MoySkladProperties properties) {
        String token = properties.getApiToken();
        log.info("МойСклад: base-url={}, api-token длина={}, окончание=...{}",
                properties.getBaseUrl(),
                token == null ? 0 : token.length(),
                token == null || token.length() < 4 ? "(пусто)" : token.substring(token.length() - 4));
        this.restClient = RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + token)
                .defaultHeader("Accept", "application/json;charset=utf-8")
                .defaultHeader("Content-Type", "application/json;charset=utf-8")
                // МойСклад's edge proxy rejects requests without Accept-Encoding (415), but the
                // JDK HTTP client doesn't auto-decompress gzip just because we ask for it — so we
                // unwrap it ourselves below rather than leaving raw gzip bytes for Jackson to choke on.
                .defaultHeader("Accept-Encoding", "gzip")
                .requestInterceptor((request, body, execution) -> {
                    log.info("МойСклад запрос: {} {} заголовки={}",
                            request.getMethod(), request.getURI(), maskAuth(request.getHeaders()));
                    ClientHttpResponse response = execution.execute(request, body);
                    log.info("МойСклад ответ: статус={} заголовки={}",
                            response.getStatusCode(), response.getHeaders());
                    return maybeUngzip(response);
                })
                .build();
    }

    private static HttpHeaders maskAuth(HttpHeaders original) {
        HttpHeaders masked = new HttpHeaders();
        masked.addAll(original);
        if (masked.containsKey("Authorization")) masked.set("Authorization", "Bearer ***скрыто***");
        return masked;
    }

    private static ClientHttpResponse maybeUngzip(ClientHttpResponse response) {
        String encoding = response.getHeaders().getFirst("Content-Encoding");
        if (encoding == null || !encoding.toLowerCase().contains("gzip")) return response;
        return new ClientHttpResponse() {
            @Override
            public InputStream getBody() throws IOException {
                return new GZIPInputStream(response.getBody());
            }

            @Override
            public HttpStatusCode getStatusCode() throws IOException {
                return response.getStatusCode();
            }

            @Override
            public String getStatusText() throws IOException {
                return response.getStatusText();
            }

            @Override
            public void close() {
                response.close();
            }

            @Override
            public HttpHeaders getHeaders() {
                return response.getHeaders();
            }
        };
    }
    public List<MoySkladProductRow> fetchAllProducts() {
        List<MoySkladProductRow> all = new ArrayList<>();
        int offset = 0;
        while (true) {
            MoySkladProductListResponse page = restClient.get()
                    .uri("/entity/product?limit={limit}&offset={offset}", PAGE_LIMIT, offset)
                    .retrieve()
                    .body(MoySkladProductListResponse.class);
            if (page == null || page.rows() == null || page.rows().isEmpty()) break;
            all.addAll(page.rows());
            offset += page.rows().size();
            if (page.meta() == null || offset >= page.meta().size()) break;
        }
        return all;
    }

    public Map<String, BigDecimal> fetchStockMap() {
        Map<String, BigDecimal> stockByProductId = new HashMap<>();
        int offset = 0;
        while (true) {
            MoySkladStockListResponse page = restClient.get()
                    .uri("/report/stock/all?limit={limit}&offset={offset}", PAGE_LIMIT, offset)
                    .retrieve()
                    .body(MoySkladStockListResponse.class);
            if (page == null || page.rows() == null || page.rows().isEmpty()) break;
            for (MoySkladStockRow row : page.rows()) {
                String productId = extractProductId(row);
                if (productId != null && row.stock() != null) {
                    stockByProductId.put(productId, row.stock());
                }
            }
            offset += page.rows().size();
            if (page.meta() == null || offset >= page.meta().size()) break;
        }
        return stockByProductId;
    }

    /** /report/stock/all rows carry no direct product id — only meta.href pointing at
     * ".../entity/product/{id}?expand=supplier". */
    private static String extractProductId(MoySkladStockRow row) {
        if (row.meta() == null || row.meta().href() == null) return null;
        Matcher m = PRODUCT_ID_IN_HREF.matcher(row.meta().href());
        return m.find() ? m.group(1) : null;
    }

    /** МойСклад stores money in kopecks and this account defines its own price types (no
     * standard "Цена продажи") — prefer "Цена Розничная" (retail), falling back to whatever
     * is listed first if that type isn't set on a given item. */
    public static BigDecimal resolvePrice(MoySkladProductRow row) {
        if (row.salePrices() == null || row.salePrices().isEmpty()) return BigDecimal.ZERO;
        Double kopecks = row.salePrices().stream()
                .filter(p -> p.priceType() != null && SALE_PRICE_TYPE.equals(p.priceType().name()))
                .map(MoySkladSalePrice::value)
                .findFirst()
                .orElseGet(() -> row.salePrices().get(0).value());
        if (kopecks == null) return BigDecimal.ZERO;
        return BigDecimal.valueOf(kopecks).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
