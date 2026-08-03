package ru.aston.backend.order;

import java.math.BigDecimal;

public record OrderItemDto(String name, int qty, BigDecimal price) {
}
