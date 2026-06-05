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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamRepository examRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private ExamMapper examMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExamService examService;

    @SuppressWarnings({ "unchecked", "null" })
    @Test
    void findAllForUser_ShouldReturnMappedPage() {
        User user = User.builder().username("student").build();
        Course course = new Course();
        Exam exam = new Exam();
        exam.setCourse(course);
        ExamDTO dto = new ExamDTO();
        Page<Exam> page = new PageImpl<>(List.of(exam));

        when(userRepository.findByUsername("student")).thenReturn(Optional.of(user));
        when(enrollmentRepository.findAllByUser(user)).thenReturn(List.of(Enrollment.builder().course(course).build()));
        when(((JpaSpecificationExecutor<Exam>) examRepository).findAll((Specification<Exam>) any(), any(Pageable.class)))
                .thenReturn(page);
        when(examMapper.toDto(any(Exam.class))).thenReturn(dto);
        when(enrollmentRepository.countByCourseAndActiveTrue(any())).thenReturn(5L);

        Page<ExamDTO> result = examService.findAllForUser("student", Specification.where(null), PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals(5, result.getContent().get(0).getParticipants());
        verify(examRepository).findAll((Specification<Exam>) any(), any(Pageable.class));
    }

    @SuppressWarnings({ "unchecked", "null" })
    @Test
    void findUpcomingForUser_ShouldReturnMappedPage() {
        User user = User.builder().username("student").build();
        Course course = new Course();
        Exam exam = new Exam();
        exam.setCourse(course);
        ExamDTO dto = new ExamDTO();
        Page<Exam> page = new PageImpl<>(List.of(exam));

        when(userRepository.findByUsername("student")).thenReturn(Optional.of(user));
        when(enrollmentRepository.findAllByUser(user)).thenReturn(List.of(Enrollment.builder().course(course).build()));
        when(((JpaSpecificationExecutor<Exam>) examRepository).findAll((Specification<Exam>) any(), any(Pageable.class)))
                .thenReturn(page);
        when(examMapper.toDto(any(Exam.class))).thenReturn(dto);
        when(enrollmentRepository.countByCourseAndActiveTrue(any())).thenReturn(10L);

        Page<ExamDTO> result = examService.findUpcomingForUser("student", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals(10, result.getContent().get(0).getParticipants());
        verify(examRepository).findAll((Specification<Exam>) any(), any(Pageable.class));
    }
}
