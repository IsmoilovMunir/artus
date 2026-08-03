package ru.aston.backend.user;

import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Component
public class UserMapper {

    private static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("dd.MM.yyyy, HH:mm", new Locale("ru"));

    public UserDto toDto(AdminUser u) {
        String lastLogin = u.getLastLogin() == null ? "—" : FORMAT.format(u.getLastLogin());
        return new UserDto(u.getId().toString(), u.getName(), u.getEmail(), u.getRole(), u.getStatus(), lastLogin);
    }
}
