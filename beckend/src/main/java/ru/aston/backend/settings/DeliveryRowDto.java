package ru.aston.backend.settings;

import java.math.BigDecimal;

public record DeliveryRowDto(String id, String name, BigDecimal cost) {
}
