package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.AssignmentDTO;
import com.student.dashboard.server.dto.AssignmentSubmissionDTO;
import com.student.dashboard.server.entity.Assignment;
import com.student.dashboard.server.entity.AssignmentSubmission;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.entity.Subject;
import com.student.dashboard.server.repository.AssignmentRepository;
import com.student.dashboard.server.repository.AssignmentSubmissionRepository;
import com.student.dashboard.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAssignmentsForTeacher(UUID teacherUuid) {
        return assignmentRepository.findByTeacherUuid(teacherUuid).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AssignmentDTO createAssignment(AssignmentDTO dto, UUID teacherUuid) {
        User teacher = userRepository.findByUuid(teacherUuid)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        Subject subject = new Subject();
        subject.setUuid(dto.getSubjectUuid());

        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setTeacher(teacher);
        assignment.setSubject(subject);

        return toDto(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentDTO updateAssignment(UUID uuid, AssignmentDTO dto) {
        Assignment assignment = assignmentRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Assignment not found with UUID: " + uuid));
        
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());

        return toDto(assignmentRepository.save(assignment));
    }

    @Transactional
    public void deleteAssignment(UUID uuid) {
        Assignment assignment = assignmentRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Assignment not found with UUID: " + uuid));
        assignmentRepository.delete(assignment);
    }

    @Transactional
    public AssignmentSubmissionDTO submitAssignment(UUID assignmentUuid, UUID studentUuid, String content) {
        Assignment assignment = assignmentRepository.findByUuid(assignmentUuid)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User student = userRepository.findByUuid(studentUuid)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        AssignmentSubmission submission = submissionRepository.findByAssignmentUuidAndStudentUuid(assignmentUuid, studentUuid)
                .orElse(new AssignmentSubmission());

        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContent(content);
        submission.setSubmittedAt(LocalDateTime.now());

        return toSubmissionDto(submissionRepository.save(submission));
    }

    @Transactional(readOnly = true)
    public List<AssignmentSubmissionDTO> getSubmissionsForAssignment(UUID assignmentUuid) {
        return submissionRepository.findByAssignmentUuid(assignmentUuid).stream()
                .map(this::toSubmissionDto)
                .toList();
    }

    @Transactional
    public AssignmentSubmissionDTO gradeSubmission(UUID submissionUuid, Integer score, String feedback) {
        AssignmentSubmission submission = submissionRepository.findByUuid(submissionUuid)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setScore(score);
        submission.setFeedback(feedback);
        return toSubmissionDto(submissionRepository.save(submission));
    }

    private AssignmentDTO toDto(Assignment assignment) {
        return AssignmentDTO.builder()
                .uuid(assignment.getUuid())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .subjectName(assignment.getSubject().getName())
                .subjectUuid(assignment.getSubject().getUuid())
                .build();
    }

    private AssignmentSubmissionDTO toSubmissionDto(AssignmentSubmission sub) {
        return AssignmentSubmissionDTO.builder()
                .uuid(sub.getUuid())
                .assignmentUuid(sub.getAssignment().getUuid())
                .assignmentTitle(sub.getAssignment().getTitle())
                .studentUuid(sub.getStudent().getUuid())
                .studentName(sub.getStudent().getUsername())
                .content(sub.getContent())
                .submittedAt(sub.getSubmittedAt())
                .score(sub.getScore())
                .feedback(sub.getFeedback())
                .build();
    }
}
