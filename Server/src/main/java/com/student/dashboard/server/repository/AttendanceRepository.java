package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentUuidAndDateBetween(UUID studentUuid, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByStudentUuidAndSubjectUuid(UUID studentUuid, UUID subjectUuid);

    List<Attendance> findByStudentUuid(UUID studentUuid);
}
