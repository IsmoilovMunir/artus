package ru.aston.backend.product;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryUpsertRequest {
    @NotBlank
    private String name;
    private String swatch;
    private Integer sortOrder;
}
