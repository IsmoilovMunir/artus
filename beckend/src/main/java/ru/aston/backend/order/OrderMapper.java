package ru.aston.backend.order;

import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Component
public class OrderMapper {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy", new Locale("ru"));

    public OrderDto toDto(Order o) {
        List<OrderItemDto> items = o.getItems().stream()
                .map(it -> new OrderItemDto(it.getProductNameSnapshot(), it.getQty(), it.getPriceSnapshot()))
                .toList();
        return new OrderDto(
                o.getOrderNumber(),
                o.getCustomer().getId().toString(),
                o.getOrderDate().format(DATE_FORMAT),
                o.getStatus(),
                o.getPaymentStatus(),
                o.getDeliveryMethod(),
                o.getAddress(),
                o.getPhone(),
                o.getEmail(),
                items,
                o.getShippingCost()
        );
    }
}
