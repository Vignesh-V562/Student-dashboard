package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.DashboardSummaryDTO;
import com.student.dashboard.server.entity.Enrollment;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.repository.EnrollmentRepository;
import com.student.dashboard.server.repository.ExamRepository;
import com.student.dashboard.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExamRepository examRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryDTO getSummary() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get exams for the courses the user is enrolled in
        long total = examRepository.countByCourseIn(
                enrollmentRepository.findAllByUser(user).stream()
                        .map(Enrollment::getCourse)
                        .toList());

        long pending = examRepository.countByCourseInAndStatus(
                enrollmentRepository.findAllByUser(user).stream()
                        .map(Enrollment::getCourse)
                        .toList(),
                com.student.dashboard.server.entity.enums.ExamStatus.UPCOMING);

        long completed = examRepository.countByCourseInAndStatus(
                enrollmentRepository.findAllByUser(user).stream()
                        .map(Enrollment::getCourse)
                        .toList(),
                com.student.dashboard.server.entity.enums.ExamStatus.COMPLETED);

        long enrolled = enrollmentRepository.findAllByUser(user).size();

        return DashboardSummaryDTO.builder()
                .totalExams(total)
                .pendingExams(pending)
                .completedExams(completed)
                .enrolledCourses(enrolled)
                .build();
    }
}
