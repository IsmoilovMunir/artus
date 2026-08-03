package ru.aston.backend.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

/**
 * Request body for creating/updating a product. Deliberately has no `stock` field — that's
 * owned by МойСклад forever per docs/01-domain-and-business.md §2.2 (any such key sent by an
 * old client is just ignored by Jackson rather than rejected). `name`/`price` ARE editable
 * here: МойСклад only seeds them once, on the sync that first imports a product — after that
 * they belong to the admin like every other field on this DTO.
 */
@Getter
@Setter
public class ProductUpsertRequest {
    @NotBlank
    private String name;
    @NotNull
    @DecimalMin(value = "0", inclusive = true)
    private BigDecimal price;
    @NotBlank
    private String sku;
    @NotBlank
    private String brand;
    @NotBlank
    private String category;
    private String panel;
    private String resolution;
    private String platform;
    private String size;
    private ProductStatus status;
    private String description;
    private List<String> accessories;
    private List<ProductSpecDto> specs;
    private String seoTitle;
    private String seoDescription;
    private String slug;
    private String seoKeywords;
    private String photoAlt;
}
