package ru.aston.backend.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_spec")
@Getter
@Setter
public class ProductSpec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "spec_key", nullable = false)
    private String specKey;

    @Column(name = "spec_value")
    private String specValue;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
