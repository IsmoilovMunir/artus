package ru.aston.backend.product;

import java.math.BigDecimal;
import java.util.List;

public record ProductDto(
        String id,
        String name,
        String sku,
        String brand,
        String category,
        String panel,
        String resolution,
        String platform,
        String size,
        BigDecimal price,
        BigDecimal oldPrice,
        Integer stock,
        ProductStatus status,
        String description,
        List<String> accessories,
        List<ProductSpecDto> specs,
        String seoTitle,
        String seoDescription,
        String slug,
        String seoKeywords,
        String photoAlt,
        List<ProductPhotoDto> photos
) {
}
