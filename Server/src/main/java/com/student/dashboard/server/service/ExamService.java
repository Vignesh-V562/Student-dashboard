package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.ExamDTO;
import com.student.dashboard.server.entity.Course;
import com.student.dashboard.server.entity.Enrollment;
import com.student.dashboard.server.entity.Exam;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.mapper.ExamMapper;
import com.student.dashboard.server.repository.EnrollmentRepository;
import com.student.dashboard.server.repository.ExamRepository;
import com.student.dashboard.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ExamMapper examMapper;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ExamDTO> findAllForUser(String username, Specification<Exam> spec, Pageable pageable) {
        Specification<Exam> scoped = spec.and(enrollmentSpec(username));
        return examRepository.findAll(scoped, pageable).map(this::convertToDtoWithParticipants);
    }

    @Transactional(readOnly = true)
    public ExamDTO findByUuid(UUID uuid) {
        return examRepository.findByUuid(uuid)
                .map(this::convertToDtoWithParticipants)
                .orElseThrow(() -> new RuntimeException("Exam not found with UUID: " + uuid));
    }

    @Transactional(readOnly = true)
    public Page<ExamDTO> findUpcomingForUser(String username, Pageable pageable) {
        Specification<Exam> spec = (root, query, cb) -> cb.greaterThan(root.get("scheduledAt"),
                java.time.LocalDateTime.now());
        return findAllForUser(username, spec, pageable);
    }

    @SuppressWarnings("null")
    @Transactional
    public ExamDTO createExam(ExamDTO examDTO) {
        Exam exam = examMapper.toEntity(examDTO);
        return convertToDtoWithParticipants(examRepository.save(exam));
    }

    @Transactional
    public ExamDTO updateExam(UUID uuid, ExamDTO examDTO) {
        Exam existingExam = examRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Exam not found with UUID: " + uuid));
        
        existingExam.setTitle(examDTO.getTitle());
        existingExam.setDescription(examDTO.getDescription());
        existingExam.setScheduledAt(examDTO.getScheduledAt());
        existingExam.setDurationMinutes(examDTO.getDurationMinutes());
        // Course and subject changes ignored here for simplicity
        
        return convertToDtoWithParticipants(examRepository.save(existingExam));
    }

    @Transactional
    public void deleteExam(UUID uuid) {
        Exam existingExam = examRepository.findByUuid(uuid)
                .orElseThrow(() -> new RuntimeException("Exam not found with UUID: " + uuid));
        examRepository.delete(existingExam);
    }

    private Specification<Exam> enrollmentSpec(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Course> courses = enrollmentRepository.findAllByUser(user).stream()
                .map(Enrollment::getCourse)
                .toList();
        if (courses.isEmpty()) {
            return (root, query, cb) -> cb.disjunction();
        }
        return (root, query, cb) -> root.get("course").in(courses);
    }

    private ExamDTO convertToDtoWithParticipants(Exam exam) {
        ExamDTO dto = examMapper.toDto(exam);
        dto.setParticipants((int) enrollmentRepository.countByCourseAndActiveTrue(exam.getCourse()));
        return dto;
    }
}
