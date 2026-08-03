package ru.aston.backend.moysklad;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.aston.backend.settings.StoreSettings;
import ru.aston.backend.settings.StoreSettingsRepository;
import ru.aston.backend.settings.WarehouseSyncLog;
import ru.aston.backend.settings.WarehouseSyncLogRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Orchestrates one full МойСклад → product sync cycle: fetch catalog + stock, upsert every
 * row, then record the outcome (log entry + last-sync timestamp) so both the scheduler and
 * the manual "Синхронизировать сейчас" button go through the exact same code path. */
@Service
@RequiredArgsConstructor
@Slf4j
public class MoySkladSyncService {

    private static final DateTimeFormatter SYNC_FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm", new Locale("ru"));

    private final MoySkladClient moySkladClient;
    private final MoySkladProperties moySkladProperties;
    private final MoySkladProductUpserter productUpserter;
    private final StoreSettingsRepository storeSettingsRepository;
    private final WarehouseSyncLogRepository warehouseSyncLogRepository;

    public void syncNow() {
        String message;
        try {
            message = runSync();
        } catch (Exception e) {
            log.error("МойСклад sync failed", e);
            message = "Ошибка синхронизации: " + e.getMessage();
        }
        recordOutcome(message);
    }

    private String runSync() {
        List<MoySkladProductRow> rows = moySkladClient.fetchAllProducts();
        Map<String, BigDecimal> stockByProductId = moySkladClient.fetchStockMap();

        int created = 0;
        int updated = 0;
        int errors = 0;
        for (MoySkladProductRow row : rows) {
            try {
                if (productUpserter.upsert(row, stockByProductId.get(row.id()))) {
                    created++;
                } else {
                    updated++;
                }
            } catch (Exception e) {
                errors++;
                log.warn("Не удалось синхронизировать товар МойСклад id={}: {}", row.id(), e.getMessage());
            }
        }
        return "МойСклад: создано %d, обновлено %d, ошибок %d".formatted(created, updated, errors);
    }

    private void recordOutcome(String message) {
        StoreSettings settings = storeSettingsRepository.findById((short) 1)
                .orElseThrow(() -> new IllegalStateException("Настройки магазина не инициализированы"));
        settings.setWhLastSync(LocalDateTime.now().format(SYNC_FORMAT));
        settings.setWhEndpoint(moySkladProperties.getBaseUrl());
        storeSettingsRepository.save(settings);

        WarehouseSyncLog logEntry = new WarehouseSyncLog();
        logEntry.setMessage(message);
        warehouseSyncLogRepository.save(logEntry);
    }
}
