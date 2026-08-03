package ru.aston.backend.product;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.aston.backend.common.exception.NotFoundException;
import ru.aston.backend.storage.FileStorageService;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public List<ProductDto> list(String search, String brand, String category, String stock) {
        Specification<Product> spec = Specification.allOf(
                ProductSpecifications.search(search),
                ProductSpecifications.brand(brand),
                ProductSpecifications.category(category),
                ProductSpecifications.stockBucket(stock)
        );
        return productRepository.findAll(spec).stream()
                .sorted(Comparator.comparing(Product::getId))
                .map(productMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDto get(Long id) {
        return productMapper.toDto(findEntity(id));
    }

    public ProductDto create(ProductUpsertRequest req) {
        Product p = new Product();
        // Stock is the only field МойСклад owns forever, so it has no place on the request DTO —
        // a manually-created product starts at 0 until a sync links it to a real МойСклад item.
        p.setStock(0);
        applyRequest(p, req);
        return productMapper.toDto(productRepository.save(p));
    }

    public ProductDto update(Long id, ProductUpsertRequest req) {
        Product p = findEntity(id);
        applyRequest(p, req);
        return productMapper.toDto(productRepository.save(p));
    }

    private void applyRequest(Product p, ProductUpsertRequest req) {
        productMapper.applyEditableFields(p, req);
        p.setBrand(brandRepository.findByName(req.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Неизвестный бренд: " + req.getBrand())));
        p.setCategory(categoryRepository.findByName(req.getCategory())
                .orElseThrow(() -> new IllegalArgumentException("Неизвестная категория: " + req.getCategory())));

        p.getSpecs().clear();
        if (req.getSpecs() != null) {
            int i = 0;
            for (ProductSpecDto s : req.getSpecs()) {
                ProductSpec entity = new ProductSpec();
                entity.setProduct(p);
                entity.setSpecKey(s.key());
                entity.setSpecValue(s.value());
                entity.setSortOrder(i++);
                p.getSpecs().add(entity);
            }
        }

        p.getAccessories().clear();
        if (req.getAccessories() != null) {
            int i = 0;
            for (String label : req.getAccessories()) {
                ProductAccessory entity = new ProductAccessory();
                entity.setProduct(p);
                entity.setLabel(label);
                entity.setSortOrder(i++);
                p.getAccessories().add(entity);
            }
        }
    }

    public ProductPhotoDto addPhoto(Long productId, MultipartFile file, boolean asMain) {
        Product p = findEntity(productId);
        String objectKey = fileStorageService.upload(file);
        if (asMain) {
            p.getPhotos().forEach(ph -> ph.setMain(false));
        }
        ProductPhoto photo = new ProductPhoto();
        photo.setProduct(p);
        photo.setObjectKey(objectKey);
        photo.setMain(asMain || p.getPhotos().isEmpty());
        photo.setSortOrder(p.getPhotos().size());
        p.getPhotos().add(photo);
        productRepository.save(p);
        ProductPhoto saved = p.getPhotos().get(p.getPhotos().size() - 1);
        return new ProductPhotoDto(saved.getId().toString(), fileStorageService.publicUrl(saved.getObjectKey()), saved.isMain());
    }

    public void deletePhoto(Long productId, Long photoId) {
        Product p = findEntity(productId);
        ProductPhoto photo = p.getPhotos().stream()
                .filter(ph -> ph.getId().equals(photoId))
                .findFirst()
                .orElseThrow(() -> NotFoundException.of("Фото товара", photoId));
        fileStorageService.delete(photo.getObjectKey());
        p.getPhotos().remove(photo);
        productRepository.save(p);
    }

    private Product findEntity(Long id) {
        return productRepository.findById(id).orElseThrow(() -> NotFoundException.of("Товар", id));
    }
}
