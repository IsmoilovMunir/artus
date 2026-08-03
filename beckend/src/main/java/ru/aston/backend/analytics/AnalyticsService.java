package ru.aston.backend.analytics;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Sales-trend and top-seller figures aren't derivable from the current order snapshot
 * (there's no historical daily-revenue table yet) so — same as the original design mockup —
 * this stays a small fixed dataset until a real reporting/warehouse-history feature exists.
 */
@Service
public class AnalyticsService {

    private static final List<Long> SALES_TREND = List.of(
            62_000L, 58_000L, 71_000L, 66_000L, 80_000L, 74_000L, 90_000L,
            85_000L, 102_000L, 96_000L, 110_000L, 104_000L, 121_000L, 118_000L
    );

    private static final List<TopProductDto> TOP_PRODUCTS = List.of(
            new TopProductDto("Samsung Neo QLED QN90D 55\"", 58),
            new TopProductDto("Xiaomi TV A Pro 50\"", 51),
            new TopProductDto("LG QNED80 65\"", 37),
            new TopProductDto("TCL C755 65\"", 29),
            new TopProductDto("Кабель HDMI 2.1 8K", 24)
    );

    private static final List<BreakdownRowDto> CATEGORY_BREAKDOWN = List.of(
            new BreakdownRowDto("Телевизоры", "2 840 000 ₽", 78),
            new BreakdownRowDto("Саундбары", "412 000 ₽", 38),
            new BreakdownRowDto("Крепления", "186 000 ₽", 22),
            new BreakdownRowDto("Кабели и мелкие аксессуары", "94 000 ₽", 14)
    );

    private static final List<BrandBreakdownRowDto> BRAND_BREAKDOWN = List.of(
            new BrandBreakdownRowDto("Samsung", 32),
            new BrandBreakdownRowDto("LG", 24),
            new BrandBreakdownRowDto("Sony", 19),
            new BrandBreakdownRowDto("Xiaomi", 14),
            new BrandBreakdownRowDto("TCL", 8),
            new BrandBreakdownRowDto("Aston", 3)
    );

    public DashboardAnalyticsDto dashboard() {
        return new DashboardAnalyticsDto(SALES_TREND, "14 дней назад", "сегодня", TOP_PRODUCTS);
    }

    public BreakdownAnalyticsDto breakdown() {
        return new BreakdownAnalyticsDto(SALES_TREND, CATEGORY_BREAKDOWN, BRAND_BREAKDOWN);
    }
}
