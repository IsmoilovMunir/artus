package ru.aston.backend.product;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LookupController {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @GetMapping("/categories")
    public List<String> categories() {
        return categoryRepository.findAll(Sort.by("sortOrder")).stream().map(Category::getName).toList();
    }

    @GetMapping("/brands")
    public List<String> brands() {
        return brandRepository.findAll(Sort.by("name")).stream().map(Brand::getName).toList();
    }
}
