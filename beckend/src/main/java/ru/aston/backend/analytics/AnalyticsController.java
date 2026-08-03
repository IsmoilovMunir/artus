package ru.aston.backend.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public DashboardAnalyticsDto dashboard() {
        return analyticsService.dashboard();
    }

    @GetMapping("/breakdown")
    public BreakdownAnalyticsDto breakdown() {
        return analyticsService.breakdown();
    }
}
