package ru.aston.backend.order;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.common.exception.NotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public List<OrderDto> list(OrderStatus status) {
        List<Order> orders = status == null
                ? orderRepository.findAllByOrderByOrderNumberDesc()
                : orderRepository.findByStatusOrderByOrderNumberDesc(status);
        return orders.stream().map(orderMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public OrderDto get(String orderNumber) {
        return orderMapper.toDto(findEntity(orderNumber));
    }

    public OrderDto updateStatus(String orderNumber, OrderStatus status) {
        Order order = findEntity(orderNumber);
        order.setStatus(status);
        return orderMapper.toDto(orderRepository.save(order));
    }

    private Order findEntity(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> NotFoundException.of("Заказ", orderNumber));
    }
}
