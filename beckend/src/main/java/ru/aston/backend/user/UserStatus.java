package ru.aston.backend.user;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserStatus {
    ACTIVE("Активен"),
    BLOCKED("Заблокирован");

    private final String label;

    UserStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static UserStatus fromLabel(String label) {
        for (UserStatus v : values()) {
            if (v.label.equals(label)) return v;
        }
        throw new IllegalArgumentException("Неизвестный статус пользователя: " + label);
    }
}
