package ru.aston.backend.user;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    ADMIN("Администратор"),
    MANAGER("Менеджер"),
    CONTENT_MANAGER("Контент-менеджер");

    private final String label;

    UserRole(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static UserRole fromLabel(String label) {
        for (UserRole v : values()) {
            if (v.label.equals(label)) return v;
        }
        throw new IllegalArgumentException("Неизвестная роль: " + label);
    }
}
