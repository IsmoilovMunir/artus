package ru.aston.backend.settings;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PctUpdateRequest(@NotNull BigDecimal pct) {
}
