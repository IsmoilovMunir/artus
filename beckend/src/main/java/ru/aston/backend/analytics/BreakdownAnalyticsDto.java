package ru.aston.backend.analytics;

import java.util.List;

public record BreakdownAnalyticsDto(
        List<Long> salesTrendBig,
        List<BreakdownRowDto> categoryBreakdown,
        List<BrandBreakdownRowDto> brandBreakdown
) {
}
