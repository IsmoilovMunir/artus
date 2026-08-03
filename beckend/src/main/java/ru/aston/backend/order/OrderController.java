package ru.aston.backend.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> list(@RequestParam(required = false) OrderStatus status) {
        return orderService.list(status);
    }

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable String id) {
        return orderService.get(id);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable String id, @Valid @RequestBody OrderStatusUpdateRequest req) {
        return orderService.updateStatus(id, req.status());
    }
}
