package ru.aston.backend.product;

import org.springframework.stereotype.Component;
import ru.aston.backend.storage.FileStorageService;

import java.util.List;

@Component
public class ProductMapper {

    private final FileStorageService fileStorageService;

    public ProductMapper(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public ProductDto toDto(Product p) {
        List<String> accessories = p.getAccessories().stream().map(ProductAccessory::getLabel).toList();
        List<ProductSpecDto> specs = p.getSpecs().stream()
                .map(s -> new ProductSpecDto(s.getSpecKey(), s.getSpecValue()))
                .toList();
        List<ProductPhotoDto> photos = p.getPhotos().stream()
                .map(ph -> new ProductPhotoDto(ph.getId().toString(), fileStorageService.publicUrl(ph.getObjectKey()), ph.isMain()))
                .toList();

        return new ProductDto(
                p.getId().toString(),
                p.getName(),
                p.getSku(),
                p.getBrand().getName(),
                p.getCategory().getName(),
                p.getPanel(),
                p.getResolution(),
                p.getPlatform(),
                p.getSize(),
                p.getPrice(),
                p.getOldPrice(),
                p.getStock(),
                p.getStatus(),
                p.getDescription(),
                accessories,
                specs,
                p.getSeoTitle(),
                p.getSeoDescription(),
                p.getSlug(),
                p.getSeoKeywords(),
                p.getPhotoAlt(),
                photos
        );
    }

    /** Applies every editable field from the request onto the entity. Brand/category
     * resolution and specs/accessories collection sync happen in the service, which owns
     * the repositories those need. */
    public void applyEditableFields(Product p, ProductUpsertRequest req) {
        p.setName(req.getName());
        p.setPrice(req.getPrice());
        p.setSku(req.getSku());
        p.setPanel(req.getPanel());
        p.setResolution(req.getResolution());
        p.setPlatform(req.getPlatform());
        p.setSize(req.getSize());
        if (req.getStatus() != null) p.setStatus(req.getStatus());
        p.setDescription(req.getDescription());
        p.setSeoTitle(req.getSeoTitle());
        p.setSeoDescription(req.getSeoDescription());
        p.setSlug(req.getSlug());
        p.setSeoKeywords(req.getSeoKeywords());
        p.setPhotoAlt(req.getPhotoAlt());
    }
}
