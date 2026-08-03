package ru.aston.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.aston.backend.common.exception.NotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final AdminUserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<UserDto> list() {
        return userRepository.findAll().stream().map(userMapper::toDto).toList();
    }

    public UserDto updateRole(Long id, UserRole role) {
        AdminUser user = findEntity(id);
        user.setRole(role);
        return userMapper.toDto(userRepository.save(user));
    }

    public UserDto toggleStatus(Long id) {
        AdminUser user = findEntity(id);
        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE);
        return userMapper.toDto(userRepository.save(user));
    }

    private AdminUser findEntity(Long id) {
        return userRepository.findById(id).orElseThrow(() -> NotFoundException.of("Пользователь", id));
    }
}
