package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.DashboardSummaryDTO;
import com.student.dashboard.server.entity.Enrollment;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.repository.EnrollmentRepository;
import com.student.dashboard.server.repository.ExamRepository;
import com.student.dashboard.server.repository.UserRepository;
import com.student.dashboard.server.repository.AssignmentRepository;
import com.student.dashboard.server.entity.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExamRepository examRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryDTO getSummary() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    @Transactional(readOnly = true)
    public Map<String, Object> getTeacherSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStudents", userRepository.countByRole(UserRole.STUDENT));
        summary.put("totalExams", examRepository.count());
        summary.put("totalAssignments", assignmentRepository.count());
        summary.put("avgAttendance", 85); // Simulated
        return summary;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAttendanceTrends() {
        List<Map<String, Object>> trends = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        int[] present = {85, 90, 88, 92, 85, 40, 30};
        for(int i=0; i<days.length; i++) {
            Map<String, Object> day = new HashMap<>();
            day.put("name", days[i]);
            day.put("attendance", present[i]);
            trends.add(day);
        }
        return trends;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getGradeDistribution() {
        List<Map<String, Object>> dist = new ArrayList<>();
        String[] grades = {"A", "B", "C", "D", "F"};
        int[] counts = {15, 25, 20, 5, 2};
        for(int i=0; i<grades.length; i++) {
            Map<String, Object> g = new HashMap<>();
            g.put("grade", grades[i]);
            g.put("students", counts[i]);
            dist.add(g);
        }
        return dist;
    }
}
