package ru.aston.backend.product;

import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> search(String query) {
        if (query == null || query.isBlank()) return null;
        String like = "%" + query.trim().toLowerCase() + "%";
        return (root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("sku")), like)
        );
    }

    public static Specification<Product> brand(String brandName) {
        if (brandName == null || brandName.isBlank()) return null;
        return (root, cq, cb) -> cb.equal(root.get("brand").get("name"), brandName);
    }

    public static Specification<Product> category(String categoryName) {
        if (categoryName == null || categoryName.isBlank()) return null;
        return (root, cq, cb) -> cb.equal(root.get("category").get("name"), categoryName);
    }

    /** stockBucket matches the admin frontend's stock filter labels verbatim ("В наличии" / "Низкий остаток" / "Нет в наличии"). */
    public static Specification<Product> stockBucket(String stockBucket) {
        if (stockBucket == null || stockBucket.isBlank()) return null;
        return switch (stockBucket) {
            case "Нет в наличии" -> (root, cq, cb) -> cb.equal(root.get("stock"), 0);
            case "Низкий остаток" -> (root, cq, cb) -> cb.and(cb.gt(root.get("stock"), 0), cb.le(root.get("stock"), 5));
            case "В наличии" -> (root, cq, cb) -> cb.gt(root.get("stock"), 5);
            default -> null;
        };
    }
}
