package ru.aston.backend.user;

public record UserDto(String id, String name, String email, UserRole role, UserStatus status, String lastLogin) {
}
