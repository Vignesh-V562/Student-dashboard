package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUuid(UUID uuid);
    java.util.List<User> findByRole(com.student.dashboard.server.entity.enums.UserRole role);
    long countByRole(com.student.dashboard.server.entity.enums.UserRole role);
}
