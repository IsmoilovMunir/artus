package ru.aston.backend.order;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {
    NEW("Новый"),
    PROCESSING("В обработке"),
    SHIPPED("Отправлен"),
    DELIVERED("Доставлен"),
    CANCELLED("Отменён");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static OrderStatus fromLabel(String label) {
        for (OrderStatus v : values()) {
            if (v.label.equals(label)) return v;
        }
        throw new IllegalArgumentException("Неизвестный статус заказа: " + label);
    }
}
