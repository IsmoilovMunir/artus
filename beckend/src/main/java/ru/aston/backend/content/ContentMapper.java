package ru.aston.backend.content;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class ContentMapper {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy", new Locale("ru"));

    public BannerDto toDto(Banner b) {
        return new BannerDto(b.getId().toString(), b.getTitle(), b.getSubtitle(), fmt(b.getActiveFrom()), fmt(b.getActiveTo()), b.isActive());
    }

    public PromoDto toDto(Promo p) {
        return new PromoDto(p.getId().toString(), p.getTitle(), p.getDiscountPct(), p.getScope(), fmt(p.getActiveFrom()), fmt(p.getActiveTo()), p.isActive());
    }

    public MenuItemDto toDto(MenuItem m) {
        return new MenuItemDto(m.getId().toString(), m.getName(), m.getSortOrder() == null ? 0 : m.getSortOrder(), m.isVisible());
    }

    public PageDto toDto(Page p) {
        return new PageDto(p.getId().toString(), p.getTitle(), p.getContent(), p.getMetaTitle(), p.getMetaDescription(), p.getStatus(), fmt(p.getUpdatedAt()));
    }

    public SiteSeoDto toDto(SiteSeoSettings s) {
        return new SiteSeoDto(s.getTitle(), s.getDescription(), s.getGaId(), s.isRobotsIndex());
    }

    private String fmt(LocalDate date) {
        return date == null ? null : date.format(DATE_FORMAT);
    }

    private String fmt(java.time.LocalDateTime dateTime) {
        return dateTime == null ? null : dateTime.format(DATE_FORMAT);
    }
}
