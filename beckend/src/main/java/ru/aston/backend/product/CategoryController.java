package ru.aston.backend.product;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/detailed")
    public List<CategoryDto> listDetailed() {
        return categoryService.listDetailed();
    }

    @PostMapping
    public CategoryDto create(@Valid @RequestBody CategoryUpsertRequest req) {
        return categoryService.create(req);
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @Valid @RequestBody CategoryUpsertRequest req) {
        return categoryService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
