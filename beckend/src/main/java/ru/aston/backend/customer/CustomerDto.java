package ru.aston.backend.customer;

import java.math.BigDecimal;

public record CustomerDto(String id, String name, String city, int ordersCount, BigDecimal spent, String lastOrder) {
}
