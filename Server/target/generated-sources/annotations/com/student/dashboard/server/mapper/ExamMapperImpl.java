package com.student.dashboard.server.mapper;

import com.student.dashboard.server.dto.ExamDTO;
import com.student.dashboard.server.entity.Course;
import com.student.dashboard.server.entity.Exam;
import com.student.dashboard.server.entity.Subject;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-01T11:26:23+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
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
        examDTO.setDescription( exam.getDescription() );
        examDTO.setDurationMinutes( exam.getDurationMinutes() );
        examDTO.setMaxMarks( exam.getMaxMarks() );
        examDTO.setPassingMarks( exam.getPassingMarks() );
        examDTO.setScheduledAt( exam.getScheduledAt() );
        examDTO.setStatus( exam.getStatus() );
        examDTO.setTitle( exam.getTitle() );
        examDTO.setUuid( exam.getUuid() );

        return examDTO;
    }

    @Override
    public Exam toEntity(ExamDTO examDTO) {
        if ( examDTO == null ) {
            return null;
        }

        Exam.ExamBuilder<?, ?> exam = Exam.builder();

        exam.description( examDTO.getDescription() );
        exam.durationMinutes( examDTO.getDurationMinutes() );
        exam.maxMarks( examDTO.getMaxMarks() );
        exam.passingMarks( examDTO.getPassingMarks() );
        exam.scheduledAt( examDTO.getScheduledAt() );
        exam.status( examDTO.getStatus() );
        exam.title( examDTO.getTitle() );

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
