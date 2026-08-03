package ru.aston.backend.order;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentStatus {
    PAID("Оплачен"),
    AWAITING_PAYMENT("Ожидает оплаты"),
    REFUNDED("Возврат");

    private final String label;

    PaymentStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static PaymentStatus fromLabel(String label) {
        for (PaymentStatus v : values()) {
            if (v.label.equals(label)) return v;
        }
        throw new IllegalArgumentException("Неизвестный статус оплаты: " + label);
    }
}
