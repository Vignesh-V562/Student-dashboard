package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.UUID;
import java.util.Optional;

import com.student.dashboard.server.entity.Course;
import com.student.dashboard.server.entity.enums.ExamStatus;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long>, JpaSpecificationExecutor<Exam> {
    Optional<Exam> findByUuid(UUID uuid);

    long countByCourseIn(List<Course> courses);

    long countByCourseInAndStatus(List<Course> courses, ExamStatus status);
}
