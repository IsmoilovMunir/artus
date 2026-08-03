package ru.aston.backend.settings;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WarehouseSyncLogRepository extends JpaRepository<WarehouseSyncLog, Long> {
    List<WarehouseSyncLog> findAllByOrderByOccurredAtDesc(Limit limit);
}
