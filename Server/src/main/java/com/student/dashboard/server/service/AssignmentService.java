package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.AssignmentDTO;
import com.student.dashboard.server.entity.Assignment;
import com.student.dashboard.server.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    @Transactional(readOnly = true)
    public List<AssignmentDTO> getAllAssignments(UUID studentUuid) {
        return assignmentRepository.findByStudentUuid(studentUuid).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentDTO> getPendingAssignments(UUID studentUuid) {
        return assignmentRepository.findByStudentUuidAndCompleted(studentUuid, false).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public AssignmentDTO createAssignment(AssignmentDTO dto, UUID studentUuid) {
        com.student.dashboard.server.entity.User student = new com.student.dashboard.server.entity.User();
        student.setUuid(studentUuid);

        com.student.dashboard.server.entity.Subject subject = new com.student.dashboard.server.entity.Subject();
        subject.setUuid(dto.getSubjectUuid());

        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setStudent(student);
        assignment.setSubject(subject);
        assignment.setCompleted(dto.isCompleted());
        assignment.setScore(dto.getScore());

        return toDto(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentDTO updateAssignment(UUID uuid, AssignmentDTO dto) {
        Assignment assignment = assignmentRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Assignment not found with UUID: " + uuid));
        
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setCompleted(dto.isCompleted());
        assignment.setScore(dto.getScore());

        return toDto(assignmentRepository.save(assignment));
    }

    @Transactional
    public void deleteAssignment(UUID uuid) {
        Assignment assignment = assignmentRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Assignment not found with UUID: " + uuid));
        assignmentRepository.delete(assignment);
    }

    @Transactional
    @SuppressWarnings("null")
    public Assignment saveAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    private AssignmentDTO toDto(Assignment assignment) {
        return AssignmentDTO.builder()
                .uuid(assignment.getUuid())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .subjectName(assignment.getSubject().getName())
                .subjectUuid(assignment.getSubject().getUuid())
                .completed(assignment.isCompleted())
                .score(assignment.getScore())
                .build();
    }
}
