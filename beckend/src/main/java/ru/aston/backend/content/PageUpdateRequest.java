package ru.aston.backend.content;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageUpdateRequest {
    @NotBlank
    private String title;
    private String content;
    private String metaTitle;
    private String metaDescription;
}
