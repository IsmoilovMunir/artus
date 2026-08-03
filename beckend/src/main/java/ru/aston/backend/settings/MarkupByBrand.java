package ru.aston.backend.settings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.aston.backend.product.Brand;

import java.math.BigDecimal;

@Entity
@Table(name = "markup_by_brand")
@Getter
@Setter
public class MarkupByBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(nullable = false)
    private BigDecimal pct;
}
