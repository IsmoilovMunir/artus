package ru.aston.backend.order;

import java.math.BigDecimal;
import java.util.List;

public record OrderDto(
        String id,
        String customerId,
        String date,
        OrderStatus status,
        PaymentStatus payment,
        String deliveryMethod,
        String address,
        String phone,
        String email,
        List<OrderItemDto> items,
        BigDecimal shipping
) {
}
