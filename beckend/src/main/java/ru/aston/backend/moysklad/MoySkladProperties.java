package ru.aston.backend.moysklad;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.moysklad")
@Getter
@Setter
public class MoySkladProperties {
    private String baseUrl;
    private String apiToken;
}
