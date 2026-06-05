package com.student.dashboard.server.mapper;

import com.student.dashboard.server.dto.ExamDTO;
import com.student.dashboard.server.entity.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamMapper {

    @Mapping(target = "courseName", source = "course.name")
    @Mapping(target = "subjectName", source = "subject.name")
    @Mapping(target = "participants", ignore = true)
    ExamDTO toDto(Exam exam);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "uuid", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Exam toEntity(ExamDTO examDTO);
}
