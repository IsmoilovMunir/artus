package ru.aston.backend.settings;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/** Partial update — only non-null fields are applied. Mirrors the admin frontend's
 * generic updateSettings(patch) action, which only ever sends the field(s) that changed. */
@Getter
@Setter
public class SettingsPatchRequest {
    private BigDecimal markupGeneral;
    private Boolean payCard;
    private Boolean paySbp;
    private Boolean payCash;
    private Boolean notifyEmailNewOrder;
    private Boolean notifyEmailStatusChange;
    private Boolean notifyPushLowStock;
    private String notifyEmail;
    private String storeName;
    private String storePhone;
    private String storeEmail;
    private String storeAddress;
    private String storeInn;
    private String storeOgrn;
    private String storeHours;
    private String whFreq;
}
