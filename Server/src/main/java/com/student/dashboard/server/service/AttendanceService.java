package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.AttendanceCalendarDTO;
import com.student.dashboard.server.dto.AttendanceDTO;
import com.student.dashboard.server.dto.AttendanceSummaryDTO;
import com.student.dashboard.server.entity.Attendance;
import com.student.dashboard.server.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.student.dashboard.server.dto.MarkAttendanceRequest;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.entity.Subject;
import com.student.dashboard.server.repository.UserRepository;
import com.student.dashboard.server.repository.SubjectRepository;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    @Transactional(readOnly = true)
    public List<AttendanceDTO> getAttendance(UUID studentUuid, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByStudentUuidAndDateBetween(studentUuid, startDate, endDate).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AttendanceCalendarDTO getAttendanceOverview(UUID studentUuid, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        List<Attendance> records = attendanceRepository.findByStudentUuidAndDateBetween(studentUuid, start, end);

        Map<LocalDate, String> dayStatus = new HashMap<>();
        for (Attendance record : records) {
            String status = record.isPresent() ? "present" : "absent";
            dayStatus.merge(record.getDate(), status, (existing, incoming) ->
                    "absent".equals(existing) || "absent".equals(incoming) ? "absent" : "present");
        }

        Map<UUID, List<Attendance>> bySubject = attendanceRepository.findByStudentUuid(studentUuid).stream()
                .collect(Collectors.groupingBy(a -> a.getSubject().getUuid(), LinkedHashMap::new, Collectors.toList()));

        List<AttendanceSummaryDTO> breakdown = bySubject.values().stream()
                .map(list -> {
                    Attendance first = list.get(0);
                    int present = (int) list.stream().filter(Attendance::isPresent).count();
                    int total = list.size();
                    int percentage = total == 0 ? 0 : (present * 100) / total;
                    return AttendanceSummaryDTO.builder()
                            .subjectUuid(first.getSubject().getUuid())
                            .subjectName(first.getSubject().getName())
                            .presentCount(present)
                            .totalCount(total)
                            .percentage(percentage)
                            .build();
                })
                .toList();

        return AttendanceCalendarDTO.builder()
                .dayStatus(dayStatus)
                .subjectBreakdown(breakdown)
                .build();
    }

    private AttendanceDTO toDto(Attendance attendance) {
        return AttendanceDTO.builder()
                .uuid(attendance.getUuid())
                .date(attendance.getDate())
                .subjectName(attendance.getSubject().getName())
                .subjectUuid(attendance.getSubject().getUuid())
                .present(attendance.isPresent())
                .build();
    }
    @Transactional
    public void markAttendance(MarkAttendanceRequest request) {
        User student = userRepository.findByUuid(request.getStudentUuid())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Subject subject = subjectRepository.findByUuid(request.getSubjectUuid())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        attendanceRepository.findByStudentUuidAndSubjectUuidAndDate(
                request.getStudentUuid(), request.getSubjectUuid(), request.getDate())
            .ifPresentOrElse(
                existing -> {
                    existing.setPresent(request.isPresent());
                    attendanceRepository.save(existing);
                },
                () -> {
                    Attendance attendance = Attendance.builder()
                            .student(student)
                            .subject(subject)
                            .date(request.getDate())
                            .present(request.isPresent())
                            .build();
                    attendanceRepository.save(attendance);
                }
            );
    }

    @Transactional(readOnly = true)
    public List<AttendanceDTO> getAllStudentsAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }
}
