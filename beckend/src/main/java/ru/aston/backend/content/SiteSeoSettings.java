package ru.aston.backend.content;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "site_seo_settings")
@Getter
@Setter
public class SiteSeoSettings {
    @Id
    private Short id;

    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "ga_id")
    private String gaId;

    @Column(name = "robots_index")
    private boolean robotsIndex = true;
}
