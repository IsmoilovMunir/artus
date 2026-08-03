package ru.aston.backend.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.aston.backend.product.Product;

import java.math.BigDecimal;

@Entity
@Table(name = "order_item")
@Getter
@Setter
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    /** Nullable: order history must survive the referenced product being deleted. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name_snapshot", nullable = false)
    private String productNameSnapshot;

    @Column(nullable = false)
    private Integer qty;

    @Column(name = "price_snapshot", nullable = false)
    private BigDecimal priceSnapshot;
}
