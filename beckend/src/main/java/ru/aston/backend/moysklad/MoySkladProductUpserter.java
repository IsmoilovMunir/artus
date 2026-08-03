package ru.aston.backend.moysklad;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.product.Brand;
import ru.aston.backend.product.BrandRepository;
import ru.aston.backend.product.Category;
import ru.aston.backend.product.CategoryRepository;
import ru.aston.backend.product.Product;
import ru.aston.backend.product.ProductRepository;
import ru.aston.backend.product.ProductStatus;

import java.math.BigDecimal;
import java.time.Instant;

/** Upserts a single МойСклад product into the local `product` table. Runs in its own
 * REQUIRES_NEW transaction so that one bad row (e.g. a SKU/article that collides with an
 * unrelated existing product) can't roll back the rest of the batch. */
@Component
@RequiredArgsConstructor
class MoySkladProductUpserter {

    static final String PLACEHOLDER_BRAND = "Без бренда";
    static final String PLACEHOLDER_CATEGORY = "Без категории";

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public boolean upsert(MoySkladProductRow row, BigDecimal stock) {
        Product p = productRepository.findByMoyskladId(row.id()).orElse(null);
        boolean isNew = p == null;
        if (isNew) {
            String sku = resolveSku(row);
            p = productRepository.findBySku(sku).orElse(null);
            if (p == null) {
                p = new Product();
                p.setSku(sku);
                p.setBrand(placeholderBrand());
                p.setCategory(placeholderCategory());
                p.setStatus(ProductStatus.DRAFT);
            } else {
                isNew = false; // matched an existing manually-created product by SKU/article
            }
        }

        // Name/price only come from МойСклад once, on the sync that first links this product —
        // after that they're admin-owned, same as brand/category/description/etc. Stock stays
        // МойСклад-owned forever and is refreshed on every sync.
        if (isNew) {
            p.setName(row.name());
            p.setPrice(MoySkladClient.resolvePrice(row));
        }
        p.setStock(stock == null ? 0 : stock.intValue());
        p.setMoyskladId(row.id());
        p.setMoyskladUpdatedAt(Instant.now());
        productRepository.save(p);
        return isNew;
    }

    private String resolveSku(MoySkladProductRow row) {
        if (row.article() != null && !row.article().isBlank()) return row.article();
        if (row.code() != null && !row.code().isBlank()) return row.code();
        return "MS-" + row.id();
    }

    private Brand placeholderBrand() {
        return brandRepository.findByName(PLACEHOLDER_BRAND)
                .orElseThrow(() -> new IllegalStateException("Заглушка бренда не найдена: " + PLACEHOLDER_BRAND));
    }

    private Category placeholderCategory() {
        return categoryRepository.findByName(PLACEHOLDER_CATEGORY)
                .orElseThrow(() -> new IllegalStateException("Заглушка категории не найдена: " + PLACEHOLDER_CATEGORY));
    }
}
