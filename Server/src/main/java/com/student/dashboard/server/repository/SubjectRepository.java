package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    Optional<Subject> findByUuid(UUID uuid);
}
