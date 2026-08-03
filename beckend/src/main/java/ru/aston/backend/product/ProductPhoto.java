package ru.aston.backend.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_photo")
@Getter
@Setter
public class ProductPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "object_key", nullable = false)
    private String objectKey;

    @Column(name = "is_main")
    private boolean main;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
