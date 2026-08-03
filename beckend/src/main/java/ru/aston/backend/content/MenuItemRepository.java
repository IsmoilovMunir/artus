package ru.aston.backend.content;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    default List<MenuItem> findAllOrdered() {
        return findAll(Sort.by("sortOrder"));
    }
}
