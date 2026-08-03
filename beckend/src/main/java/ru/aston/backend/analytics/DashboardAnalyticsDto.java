package ru.aston.backend.analytics;

import java.util.List;

public record DashboardAnalyticsDto(
        List<Long> salesTrend,
        String salesFirstLabel,
        String salesLastLabel,
        List<TopProductDto> topProducts
) {
}
