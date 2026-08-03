package ru.aston.backend.content;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/banners")
    public List<BannerDto> banners() {
        return contentService.listBanners();
    }

    @PatchMapping("/banners/{id}/toggle")
    public BannerDto toggleBanner(@PathVariable Long id) {
        return contentService.toggleBanner(id);
    }

    @GetMapping("/promos")
    public List<PromoDto> promos() {
        return contentService.listPromos();
    }

    @PatchMapping("/promos/{id}/toggle")
    public PromoDto togglePromo(@PathVariable Long id) {
        return contentService.togglePromo(id);
    }

    @GetMapping("/menu")
    public List<MenuItemDto> menu() {
        return contentService.listMenu();
    }

    @PatchMapping("/menu/{id}/toggle")
    public MenuItemDto toggleMenu(@PathVariable Long id) {
        return contentService.toggleMenuVisible(id);
    }

    @GetMapping("/pages")
    public List<PageDto> pages() {
        return contentService.listPages();
    }

    @PutMapping("/pages/{id}")
    public PageDto updatePage(@PathVariable Long id, @Valid @RequestBody PageUpdateRequest req) {
        return contentService.updatePage(id, req);
    }

    @GetMapping("/seo")
    public SiteSeoDto seo() {
        return contentService.getSiteSeo();
    }

    @PutMapping("/seo")
    public SiteSeoDto updateSeo(@RequestBody SiteSeoDto req) {
        return contentService.updateSiteSeo(req);
    }
}
