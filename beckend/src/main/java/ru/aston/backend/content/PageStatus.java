package ru.aston.backend.content;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PageStatus {
    PUBLISHED("Опубликовано"),
    DRAFT("Черновик");

    private final String label;

    PageStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static PageStatus fromLabel(String label) {
        for (PageStatus v : values()) {
            if (v.label.equals(label)) return v;
        }
        throw new IllegalArgumentException("Неизвестный статус страницы: " + label);
    }
}
