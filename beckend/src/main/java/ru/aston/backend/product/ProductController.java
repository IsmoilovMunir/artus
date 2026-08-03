package ru.aston.backend.product;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductDto> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String stock
    ) {
        return productService.list(search, brand, category, stock);
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable Long id) {
        return productService.get(id);
    }

    @PostMapping
    public ProductDto create(@Valid @RequestBody ProductUpsertRequest req) {
        return productService.create(req);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @Valid @RequestBody ProductUpsertRequest req) {
        return productService.update(id, req);
    }

    @PostMapping(value = "/{id}/photos", consumes = "multipart/form-data")
    public ProductPhotoDto addPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isMain", required = false, defaultValue = "false") boolean isMain
    ) {
        return productService.addPhoto(id, file, isMain);
    }

    @DeleteMapping("/{id}/photos/{photoId}")
    public void deletePhoto(@PathVariable Long id, @PathVariable Long photoId) {
        productService.deletePhoto(id, photoId);
    }
}
