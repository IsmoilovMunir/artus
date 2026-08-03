package ru.aston.backend.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByMoyskladId(String moyskladId);
    Optional<Product> findBySku(String sku);
    long countByCategory(Category category);
}
