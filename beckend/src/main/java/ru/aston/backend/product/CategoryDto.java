package ru.aston.backend.product;

public record CategoryDto(String id, String name, String swatch, Integer sortOrder, long productCount) {
}
