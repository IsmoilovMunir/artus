package ru.aston.backend.settings;

import java.math.BigDecimal;
import java.util.List;

public record SettingsDto(
        BigDecimal markupGeneral,
        List<MarkupRowDto> markupByCategory,
        List<MarkupRowDto> markupByBrand,
        boolean payCard,
        boolean paySbp,
        boolean payCash,
        List<DeliveryRowDto> delivery,
        boolean notifyEmailNewOrder,
        boolean notifyEmailStatusChange,
        boolean notifyPushLowStock,
        String notifyEmail,
        String storeName,
        String storePhone,
        String storeEmail,
        String storeAddress,
        String storeInn,
        String storeOgrn,
        String storeHours,
        String whEndpoint,
        String whFreq,
        String whLastSync,
        List<WarehouseLogEntryDto> whLog
) {
}
