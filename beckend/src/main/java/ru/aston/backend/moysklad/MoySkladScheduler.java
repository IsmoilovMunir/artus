package ru.aston.backend.moysklad;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;
import ru.aston.backend.settings.StoreSettings;
import ru.aston.backend.settings.StoreSettingsRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/** Self-rescheduling poller, rather than a fixed @Scheduled interval, so that changing the
 * "Частота синхронизации" dropdown in Настройки → Склад (store_settings.wh_freq_minutes)
 * takes effect on the very next run instead of requiring an app restart. */
@Component
@RequiredArgsConstructor
@Slf4j
public class MoySkladScheduler {

    private static final int DEFAULT_FREQ_MINUTES = 5;
    private static final int INITIAL_DELAY_SECONDS = 10;

    private final MoySkladSyncService syncService;
    private final StoreSettingsRepository storeSettingsRepository;
    private ThreadPoolTaskScheduler scheduler;

    @PostConstruct
    void start() {
        scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1);
        scheduler.setThreadNamePrefix("moysklad-sync-");
        scheduler.initialize();
        scheduler.schedule(this::runAndReschedule, Instant.now().plusSeconds(INITIAL_DELAY_SECONDS));
    }

    @PreDestroy
    void stop() {
        if (scheduler != null) scheduler.shutdown();
    }

    private void runAndReschedule() {
        try {
            syncService.syncNow();
        } catch (Exception e) {
            log.error("МойСклад scheduled sync crashed unexpectedly", e);
        } finally {
            scheduler.schedule(this::runAndReschedule, Instant.now().plus(currentFrequencyMinutes(), ChronoUnit.MINUTES));
        }
    }

    private int currentFrequencyMinutes() {
        return storeSettingsRepository.findById((short) 1)
                .map(StoreSettings::getWhFreqMinutes)
                .filter(f -> f != null && f > 0)
                .orElse(DEFAULT_FREQ_MINUTES);
    }
}
