package ru.aston.backend.content;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.common.exception.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ContentService {

    private final BannerRepository bannerRepository;
    private final PromoRepository promoRepository;
    private final MenuItemRepository menuItemRepository;
    private final PageRepository pageRepository;
    private final SiteSeoSettingsRepository siteSeoSettingsRepository;
    private final ContentMapper mapper;

    @Transactional(readOnly = true)
    public List<BannerDto> listBanners() {
        return bannerRepository.findAll().stream().map(mapper::toDto).toList();
    }

    public BannerDto toggleBanner(Long id) {
        Banner b = bannerRepository.findById(id).orElseThrow(() -> NotFoundException.of("Баннер", id));
        b.setActive(!b.isActive());
        return mapper.toDto(bannerRepository.save(b));
    }

    @Transactional(readOnly = true)
    public List<PromoDto> listPromos() {
        return promoRepository.findAll().stream().map(mapper::toDto).toList();
    }

    public PromoDto togglePromo(Long id) {
        Promo p = promoRepository.findById(id).orElseThrow(() -> NotFoundException.of("Акция", id));
        p.setActive(!p.isActive());
        return mapper.toDto(promoRepository.save(p));
    }

    @Transactional(readOnly = true)
    public List<MenuItemDto> listMenu() {
        return menuItemRepository.findAllOrdered().stream().map(mapper::toDto).toList();
    }

    public MenuItemDto toggleMenuVisible(Long id) {
        MenuItem m = menuItemRepository.findById(id).orElseThrow(() -> NotFoundException.of("Пункт меню", id));
        m.setVisible(!m.isVisible());
        return mapper.toDto(menuItemRepository.save(m));
    }

    @Transactional(readOnly = true)
    public List<PageDto> listPages() {
        return pageRepository.findAll().stream().map(mapper::toDto).toList();
    }

    public PageDto updatePage(Long id, PageUpdateRequest req) {
        Page p = pageRepository.findById(id).orElseThrow(() -> NotFoundException.of("Страница", id));
        p.setTitle(req.getTitle());
        p.setContent(req.getContent());
        p.setMetaTitle(req.getMetaTitle());
        p.setMetaDescription(req.getMetaDescription());
        p.setUpdatedAt(LocalDateTime.now());
        return mapper.toDto(pageRepository.save(p));
    }

    @Transactional(readOnly = true)
    public SiteSeoDto getSiteSeo() {
        return mapper.toDto(findSeoSingleton());
    }

    public SiteSeoDto updateSiteSeo(SiteSeoDto req) {
        SiteSeoSettings s = findSeoSingleton();
        s.setTitle(req.title());
        s.setDescription(req.description());
        s.setGaId(req.gaId());
        s.setRobotsIndex(req.robotsIndex());
        return mapper.toDto(siteSeoSettingsRepository.save(s));
    }

    private SiteSeoSettings findSeoSingleton() {
        return siteSeoSettingsRepository.findById((short) 1)
                .orElseThrow(() -> new IllegalStateException("SEO настройки сайта не инициализированы"));
    }
}
