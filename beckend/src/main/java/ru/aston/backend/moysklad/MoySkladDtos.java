package ru.aston.backend.moysklad;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.util.List;

/** МойСклад JSON API v1.2 response shapes — only the fields this sync actually reads.
 * Everything else is ignored rather than rejected, since МойСклад's real payloads carry
 * many more fields (meta.href, owner, group, etc.) that aren't relevant here. */
@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladProductListResponse(MoySkladMeta meta, List<MoySkladProductRow> rows) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladMeta(int size, int limit, int offset) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladProductRow(String id, String name, String code, String article, List<MoySkladSalePrice> salePrices) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladSalePrice(Double value, MoySkladPriceType priceType) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladPriceType(String name) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladStockListResponse(MoySkladMeta meta, List<MoySkladStockRow> rows) {
}

/** /report/stock/all rows have no direct product id field — it's embedded in meta.href
 * (".../entity/product/{id}?expand=supplier"), which MoySkladClient extracts. */
@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladStockRow(MoySkladMetaRef meta, BigDecimal stock) {
}

@JsonIgnoreProperties(ignoreUnknown = true)
record MoySkladMetaRef(String href) {
}
