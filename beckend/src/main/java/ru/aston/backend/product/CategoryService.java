package ru.aston.backend.product;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.common.exception.NotFoundException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> listDetailed() {
        return categoryRepository.findAll(Sort.by("sortOrder")).stream()
                .map(c -> toDto(c, productRepository.countByCategory(c)))
                .toList();
    }

    public CategoryDto create(CategoryUpsertRequest req) {
        if (categoryRepository.findByName(req.getName()).isPresent()) {
            throw new IllegalArgumentException("Категория «" + req.getName() + "» уже существует");
        }
        Category c = new Category();
        c.setName(req.getName());
        c.setSwatch(req.getSwatch());
        c.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : nextSortOrder());
        return toDto(categoryRepository.save(c), 0);
    }

    public CategoryDto update(Long id, CategoryUpsertRequest req) {
        Category c = findEntity(id);
        categoryRepository.findByName(req.getName())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new IllegalArgumentException("Категория «" + req.getName() + "» уже существует");
                });
        c.setName(req.getName());
        c.setSwatch(req.getSwatch());
        if (req.getSortOrder() != null) c.setSortOrder(req.getSortOrder());
        Category saved = categoryRepository.save(c);
        return toDto(saved, productRepository.countByCategory(saved));
    }

    public void delete(Long id) {
        Category c = findEntity(id);
        long count = productRepository.countByCategory(c);
        if (count > 0) {
            throw new IllegalArgumentException(
                    "Нельзя удалить категорию «" + c.getName() + "»: в ней " + count + " товар(ов)");
        }
        categoryRepository.delete(c);
    }

    private Integer nextSortOrder() {
        return categoryRepository.findAll().stream()
                .map(Category::getSortOrder)
                .filter(java.util.Objects::nonNull)
                .max(Comparator.naturalOrder())
                .map(o -> o + 1)
                .orElse(0);
    }

    private Category findEntity(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> NotFoundException.of("Категория", id));
    }

    private CategoryDto toDto(Category c, long productCount) {
        return new CategoryDto(c.getId().toString(), c.getName(), c.getSwatch(), c.getSortOrder(), productCount);
    }
}
