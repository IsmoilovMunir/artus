package ru.aston.backend.settings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "store_settings")
@Getter
@Setter
public class StoreSettings {
    @Id
    private Short id;

    @Column(name = "markup_general")
    private BigDecimal markupGeneral;

    @Column(name = "pay_card")
    private boolean payCard;
    @Column(name = "pay_sbp")
    private boolean paySbp;
    @Column(name = "pay_cash")
    private boolean payCash;

    @Column(name = "notify_email_new_order")
    private boolean notifyEmailNewOrder;
    @Column(name = "notify_email_status_change")
    private boolean notifyEmailStatusChange;
    @Column(name = "notify_push_low_stock")
    private boolean notifyPushLowStock;
    @Column(name = "notify_email")
    private String notifyEmail;

    @Column(name = "store_name")
    private String storeName;
    @Column(name = "store_phone")
    private String storePhone;
    @Column(name = "store_email")
    private String storeEmail;
    @Column(name = "store_address")
    private String storeAddress;
    @Column(name = "store_inn")
    private String storeInn;
    @Column(name = "store_ogrn")
    private String storeOgrn;
    @Column(name = "store_hours")
    private String storeHours;

    @Column(name = "wh_endpoint")
    private String whEndpoint;
    @Column(name = "wh_freq_minutes")
    private Integer whFreqMinutes;
    @Column(name = "wh_last_sync")
    private String whLastSync;
}
