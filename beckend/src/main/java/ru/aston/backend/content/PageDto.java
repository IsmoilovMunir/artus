package ru.aston.backend.content;

public record PageDto(String id, String title, String content, String metaTitle, String metaDescription, PageStatus status, String updated) {
}
