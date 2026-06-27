package com.student.dashboard.server.config;

import com.student.dashboard.server.entity.*;
import com.student.dashboard.server.entity.enums.ExamStatus;
import com.student.dashboard.server.entity.enums.UserRole;
import com.student.dashboard.server.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class DataLoader {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final ExamRepository examRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ScheduleEntryRepository scheduleEntryRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    @SuppressWarnings("null")
    @Bean
    public CommandLineRunner initData() {
        return args -> {
            User admin = ensureUser("admin", "admin@student.dashboard.com", "admin123", UserRole.ADMIN);
            User student = ensureUser("student", "student@ssn.edu.in", "student123", UserRole.STUDENT);
            User teacher = ensureUser("teacher", "teacher@student.dashboard.com", "teacher123", UserRole.TEACHER);

            Subject math = ensureSubject("MA101", "Advanced Mathematics");
            Subject english = ensureSubject("EN101", "Business English");
            Subject physics = ensureSubject("PH101", "Engineering Physics");

            Course cs101 = ensureCourse("CS101", "Computer Science 101");
            ensureEnrollment(student, cs101);

            if (examRepository.count() == 0) {
                examRepository.saveAll(Arrays.asList(
                        Exam.builder().title("Mathematics Midterm").description("Chapters 1-5")
                                .scheduledAt(LocalDateTime.now().plusDays(4).withHour(9).withMinute(0))
                                .durationMinutes(120).maxMarks(100).passingMarks(40)
                                .course(cs101).subject(math).status(ExamStatus.UPCOMING).build(),
                        Exam.builder().title("English Final").description("Essay and comprehension")
                                .scheduledAt(LocalDateTime.now().plusDays(11).withHour(11).withMinute(0))
                                .durationMinutes(90).maxMarks(100).passingMarks(40)
                                .course(cs101).subject(english).status(ExamStatus.UPCOMING).build(),
                        Exam.builder().title("Physics Quiz").description("Mechanics unit")
                                .scheduledAt(LocalDateTime.now().minusDays(3).withHour(10).withMinute(0))
                                .durationMinutes(60).maxMarks(50).passingMarks(25)
                                .course(cs101).subject(physics).status(ExamStatus.COMPLETED).build()));
            }

            if (assignmentRepository.count() == 0) {
                assignmentRepository.saveAll(Arrays.asList(
                        Assignment.builder().title("Calculus Homework").description("Problems 1-10")
                                .dueDate(LocalDateTime.now().plusDays(2)).subject(math).teacher(teacher).build(),
                        Assignment.builder().title("Essay on AI").description("Write 500 words")
                                .dueDate(LocalDateTime.now().plusDays(5)).subject(english).teacher(teacher).build()));
            }

            if (attendanceRepository.count() == 0) {
                attendanceRepository.saveAll(Arrays.asList(
                        Attendance.builder().student(student).subject(math).date(LocalDate.now().minusDays(1))
                                .present(true).build(),
                        Attendance.builder().student(student).subject(english).date(LocalDate.now().minusDays(1))
                                .present(false).build(),
                        Attendance.builder().student(student).subject(physics).date(LocalDate.now().minusDays(2))
                                .present(true).build(),
                        Attendance.builder().student(student).subject(math).date(LocalDate.now().minusDays(3))
                                .present(true).build()));
            }

            if (scheduleEntryRepository.count() == 0) {
                scheduleEntryRepository.saveAll(Arrays.asList(
                        ScheduleEntry.builder().dayOfWeek("Monday").startTime(LocalTime.of(9, 0))
                                .endTime(LocalTime.of(10, 30)).subject(math).room("A101").build(),
                        ScheduleEntry.builder().dayOfWeek("Monday").startTime(LocalTime.of(11, 0))
                                .endTime(LocalTime.of(12, 30)).subject(english).room("B202").build(),
                        ScheduleEntry.builder().dayOfWeek("Tuesday").startTime(LocalTime.of(9, 0))
                                .endTime(LocalTime.of(10, 30)).subject(physics).room("C303").build()));
            }

            if (messageRepository.count() == 0) {
                messageRepository.save(Message.builder()
                        .sender(teacher)
                        .receiver(student)
                        .content("Hello! I've reviewed your latest assignment. Great work on the analysis!")
                        .build());
            }

            System.out.println("Dev data seeded. Login: student / student123");
        };
    }

    private User ensureUser(String username, String email, String password, UserRole role) {
        return userRepository.findByUsername(username).orElseGet(() -> userRepository.save(User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .active(true)
                .build()));
    }

    private Subject ensureSubject(String code, String name) {
        return subjectRepository.findByCode(code).orElseGet(() -> subjectRepository.save(
                Subject.builder().code(code).name(name).build()));
    }

    private Course ensureCourse(String code, String name) {
        return courseRepository.findByCode(code).orElseGet(() -> courseRepository.save(
                Course.builder().code(code).name(name).build()));
    }

    private void ensureEnrollment(User student, Course course) {
        if (!enrollmentRepository.existsByUserAndCourse(student, course)) {
            enrollmentRepository.save(Enrollment.builder().user(student).course(course).active(true).build());
        }
    }
}
