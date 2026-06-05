package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.Enrollment;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findAllByUser(User user);

    Optional<Enrollment> findByUuid(UUID uuid);

    boolean existsByUserAndCourse(User user, Course course);

    long countByCourse(Course course);

    long countByCourseAndActiveTrue(Course course);
}
