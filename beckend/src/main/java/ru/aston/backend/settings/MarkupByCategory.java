package ru.aston.backend.settings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ru.aston.backend.product.Category;

import java.math.BigDecimal;

@Entity
@Table(name = "markup_by_category")
@Getter
@Setter
public class MarkupByCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private BigDecimal pct;
}
