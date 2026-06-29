package com.student.dashboard.server.mapper;

import com.student.dashboard.server.dto.ExamDTO;
import com.student.dashboard.server.entity.Course;
import com.student.dashboard.server.entity.Exam;
import com.student.dashboard.server.entity.Subject;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-29T12:25:49+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Oracle Corporation)"
)
@Component
public class ExamMapperImpl implements ExamMapper {

    @Override
    public ExamDTO toDto(Exam exam) {
        if ( exam == null ) {
            return null;
        }

        ExamDTO examDTO = new ExamDTO();

        examDTO.setCourseName( examCourseName( exam ) );
        examDTO.setSubjectName( examSubjectName( exam ) );
        examDTO.setUuid( exam.getUuid() );
        examDTO.setTitle( exam.getTitle() );
        examDTO.setDescription( exam.getDescription() );
        examDTO.setScheduledAt( exam.getScheduledAt() );
        examDTO.setDurationMinutes( exam.getDurationMinutes() );
        examDTO.setMaxMarks( exam.getMaxMarks() );
        examDTO.setPassingMarks( exam.getPassingMarks() );
        examDTO.setStatus( exam.getStatus() );

        return examDTO;
    }

    @Override
    public Exam toEntity(ExamDTO examDTO) {
        if ( examDTO == null ) {
            return null;
        }

        Exam.ExamBuilder<?, ?> exam = Exam.builder();

        exam.title( examDTO.getTitle() );
        exam.description( examDTO.getDescription() );
        exam.scheduledAt( examDTO.getScheduledAt() );
        exam.durationMinutes( examDTO.getDurationMinutes() );
        exam.maxMarks( examDTO.getMaxMarks() );
        exam.passingMarks( examDTO.getPassingMarks() );
        exam.status( examDTO.getStatus() );

        return exam.build();
    }

    private String examCourseName(Exam exam) {
        if ( exam == null ) {
            return null;
        }
        Course course = exam.getCourse();
        if ( course == null ) {
            return null;
        }
        String name = course.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String examSubjectName(Exam exam) {
        if ( exam == null ) {
            return null;
        }
        Subject subject = exam.getSubject();
        if ( subject == null ) {
            return null;
        }
        String name = subject.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
