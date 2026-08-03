package ru.aston.backend.content;

public record PromoDto(String id, String title, int discount, String scope, String from, String to, boolean active) {
}
