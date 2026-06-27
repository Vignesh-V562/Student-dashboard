package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTeacherUuid(UUID teacherUuid);

    java.util.Optional<Assignment> findByUuid(UUID uuid);
}
