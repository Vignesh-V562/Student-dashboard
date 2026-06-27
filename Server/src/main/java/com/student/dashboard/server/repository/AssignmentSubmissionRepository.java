package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    List<AssignmentSubmission> findByAssignmentUuid(UUID assignmentUuid);
    List<AssignmentSubmission> findByStudentUuid(UUID studentUuid);
    Optional<AssignmentSubmission> findByAssignmentUuidAndStudentUuid(UUID assignmentUuid, UUID studentUuid);
    Optional<AssignmentSubmission> findByUuid(UUID uuid);
}
