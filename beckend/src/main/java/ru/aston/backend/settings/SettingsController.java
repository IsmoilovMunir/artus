package ru.aston.backend.settings;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public SettingsDto get() {
        return settingsService.get();
    }

    @PutMapping
    public SettingsDto patch(@RequestBody SettingsPatchRequest req) {
        return settingsService.patch(req);
    }

    @PatchMapping("/markup/category/{id}")
    public SettingsDto updateMarkupByCategory(@PathVariable Long id, @Valid @RequestBody PctUpdateRequest req) {
        return settingsService.updateMarkupByCategory(id, req.pct());
    }

    @PatchMapping("/markup/brand/{id}")
    public SettingsDto updateMarkupByBrand(@PathVariable Long id, @Valid @RequestBody PctUpdateRequest req) {
        return settingsService.updateMarkupByBrand(id, req.pct());
    }

    @PatchMapping("/delivery/{id}")
    public SettingsDto updateDeliveryCost(@PathVariable Long id, @Valid @RequestBody CostUpdateRequest req) {
        return settingsService.updateDeliveryCost(id, req.cost());
    }

    @PostMapping("/warehouse/sync")
    public SettingsDto syncWarehouseNow() {
        return settingsService.syncWarehouseNow();
    }
}
