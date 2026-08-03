package ru.aston.backend.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.common.exception.NotFoundException;
import ru.aston.backend.moysklad.MoySkladSyncService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SettingsService {

    private final StoreSettingsRepository storeSettingsRepository;
    private final MarkupByCategoryRepository markupByCategoryRepository;
    private final MarkupByBrandRepository markupByBrandRepository;
    private final DeliveryMethodCostRepository deliveryMethodCostRepository;
    private final WarehouseSyncLogRepository warehouseSyncLogRepository;
    private final MoySkladSyncService moySkladSyncService;

    @Transactional(readOnly = true)
    public SettingsDto get() {
        return toDto(findSingleton());
    }

    public SettingsDto patch(SettingsPatchRequest req) {
        StoreSettings s = findSingleton();
        if (req.getMarkupGeneral() != null) s.setMarkupGeneral(req.getMarkupGeneral());
        if (req.getPayCard() != null) s.setPayCard(req.getPayCard());
        if (req.getPaySbp() != null) s.setPaySbp(req.getPaySbp());
        if (req.getPayCash() != null) s.setPayCash(req.getPayCash());
        if (req.getNotifyEmailNewOrder() != null) s.setNotifyEmailNewOrder(req.getNotifyEmailNewOrder());
        if (req.getNotifyEmailStatusChange() != null) s.setNotifyEmailStatusChange(req.getNotifyEmailStatusChange());
        if (req.getNotifyPushLowStock() != null) s.setNotifyPushLowStock(req.getNotifyPushLowStock());
        if (req.getNotifyEmail() != null) s.setNotifyEmail(req.getNotifyEmail());
        if (req.getStoreName() != null) s.setStoreName(req.getStoreName());
        if (req.getStorePhone() != null) s.setStorePhone(req.getStorePhone());
        if (req.getStoreEmail() != null) s.setStoreEmail(req.getStoreEmail());
        if (req.getStoreAddress() != null) s.setStoreAddress(req.getStoreAddress());
        if (req.getStoreInn() != null) s.setStoreInn(req.getStoreInn());
        if (req.getStoreOgrn() != null) s.setStoreOgrn(req.getStoreOgrn());
        if (req.getStoreHours() != null) s.setStoreHours(req.getStoreHours());
        if (req.getWhFreq() != null) s.setWhFreqMinutes(Integer.parseInt(req.getWhFreq()));
        return toDto(storeSettingsRepository.save(s));
    }

    public SettingsDto updateMarkupByCategory(Long id, java.math.BigDecimal pct) {
        MarkupByCategory row = markupByCategoryRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Наценка по категории", id));
        row.setPct(pct);
        markupByCategoryRepository.save(row);
        return get();
    }

    public SettingsDto updateMarkupByBrand(Long id, java.math.BigDecimal pct) {
        MarkupByBrand row = markupByBrandRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Наценка по бренду", id));
        row.setPct(pct);
        markupByBrandRepository.save(row);
        return get();
    }

    public SettingsDto updateDeliveryCost(Long id, java.math.BigDecimal cost) {
        DeliveryMethodCost row = deliveryMethodCostRepository.findById(id)
                .orElseThrow(() -> NotFoundException.of("Способ доставки", id));
        row.setCost(cost);
        deliveryMethodCostRepository.save(row);
        return get();
    }

    public SettingsDto syncWarehouseNow() {
        moySkladSyncService.syncNow();
        return get();
    }

    private SettingsDto toDto(StoreSettings s) {
        List<MarkupRowDto> markupByCategory = markupByCategoryRepository.findAll().stream()
                .map(m -> new MarkupRowDto(m.getId().toString(), m.getCategory().getName(), m.getPct()))
                .toList();
        List<MarkupRowDto> markupByBrand = markupByBrandRepository.findAll().stream()
                .map(m -> new MarkupRowDto(m.getId().toString(), m.getBrand().getName(), m.getPct()))
                .toList();
        List<DeliveryRowDto> delivery = deliveryMethodCostRepository.findAll().stream()
                .map(d -> new DeliveryRowDto(d.getId().toString(), d.getName(), d.getCost()))
                .toList();
        List<WarehouseLogEntryDto> whLog = warehouseSyncLogRepository.findAllByOrderByOccurredAtDesc(Limit.of(10)).stream()
                .map(l -> new WarehouseLogEntryDto(l.getOccurredAt().toLocalTime().toString().substring(0, 5), l.getMessage()))
                .toList();

        return new SettingsDto(
                s.getMarkupGeneral(), markupByCategory, markupByBrand,
                s.isPayCard(), s.isPaySbp(), s.isPayCash(), delivery,
                s.isNotifyEmailNewOrder(), s.isNotifyEmailStatusChange(), s.isNotifyPushLowStock(), s.getNotifyEmail(),
                s.getStoreName(), s.getStorePhone(), s.getStoreEmail(), s.getStoreAddress(), s.getStoreInn(), s.getStoreOgrn(), s.getStoreHours(),
                s.getWhEndpoint(), s.getWhFreqMinutes() == null ? null : String.valueOf(s.getWhFreqMinutes()), s.getWhLastSync(), whLog
        );
    }

    private StoreSettings findSingleton() {
        return storeSettingsRepository.findById((short) 1)
                .orElseThrow(() -> new IllegalStateException("Настройки магазина не инициализированы"));
    }
}
