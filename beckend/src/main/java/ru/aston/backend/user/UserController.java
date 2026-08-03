package ru.aston.backend.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserDto> list() {
        return userService.list();
    }

    @PatchMapping("/{id}/role")
    public UserDto updateRole(@PathVariable Long id, @Valid @RequestBody RoleUpdateRequest req) {
        return userService.updateRole(id, req.role());
    }

    @PatchMapping("/{id}/status")
    public UserDto toggleStatus(@PathVariable Long id) {
        return userService.toggleStatus(id);
    }
}
