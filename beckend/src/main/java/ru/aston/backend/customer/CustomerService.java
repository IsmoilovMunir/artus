package ru.aston.backend.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.order.Order;
import ru.aston.backend.order.OrderRepository;
import ru.aston.backend.order.OrderStatus;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy", new Locale("ru"));

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public List<CustomerDto> list() {
        return customerRepository.findAll().stream().map(this::toDto).toList();
    }

    private CustomerDto toDto(Customer c) {
        List<Order> orders = orderRepository.findByCustomerId(c.getId()).stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .toList();
        int ordersCount = orders.size();
        BigDecimal spent = orders.stream()
                .map(o -> itemsTotal(o).add(o.getShippingCost()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        String lastOrder = orders.stream()
                .max(Comparator.comparing(Order::getOrderDate))
                .map(o -> o.getOrderDate().format(DATE_FORMAT))
                .orElse("—");
        return new CustomerDto(c.getId().toString(), c.getName(), c.getCity(), ordersCount, spent, lastOrder);
    }

    private BigDecimal itemsTotal(Order o) {
        return o.getItems().stream()
                .map(it -> it.getPriceSnapshot().multiply(BigDecimal.valueOf(it.getQty())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
