package ru.aston.backend.product;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** JSON representation matches the admin frontend's Russian string literals verbatim
 * (see admin/src/lib/types.ts ProductStatus) so the API contract needs no translation layer on the client. */
public enum ProductStatus {
    ACTIVE("Активен"),
    DRAFT("Черновик"),
    ARCHIVED("Архив");

    private final String label;

    ProductStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static ProductStatus fromLabel(String label) {
        for (ProductStatus v : values()) {
            if (v.label.equals(label)) return v;
        }
        throw new IllegalArgumentException("Неизвестный статус товара: " + label);
    }
}
