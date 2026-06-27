package com.student.dashboard.server.controller;

import com.student.dashboard.server.entity.Attendance;
import com.student.dashboard.server.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final AttendanceRepository attendanceRepository;

    @GetMapping("/attendance/csv")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<StreamingResponseBody> exportAttendanceCsv() {
        List<Attendance> attendances = attendanceRepository.findAll();

        StreamingResponseBody stream = out -> {
            try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(out))) {
                writer.println("ID,StudentName,Subject,Date,Status");
                for (Attendance att : attendances) {
                    writer.printf("%s,%s,%s,%s,%s%n",
                            att.getUuid(),
                            att.getStudent().getUsername(),
                            att.getSubject().getName(),
                            att.getDate(),
                            att.isPresent() ? "Present" : "Absent");
                }
            }
        };

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendance_report.csv")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                .body(stream);
    }
}
