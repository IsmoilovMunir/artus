package ru.aston.backend.user;

import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(@NotNull UserRole role) {
}
