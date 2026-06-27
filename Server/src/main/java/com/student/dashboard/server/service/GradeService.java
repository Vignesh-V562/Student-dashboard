package com.student.dashboard.server.service;

import com.student.dashboard.server.entity.Grade;
import com.student.dashboard.server.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;

    public List<Grade> getGradesForUser(String userUuid) {
        return gradeRepository.findByUserUuid(userUuid);
    }

    public Grade saveGrade(String userUuid, Grade grade) {
        grade.setUserUuid(userUuid);
        return gradeRepository.save(grade);
    }

    public void deleteGrade(String id, String userUuid) {
        Grade grade = gradeRepository.findById(id).orElseThrow(() -> new RuntimeException("Grade not found"));
        if (!grade.getUserUuid().equals(userUuid)) {
            throw new RuntimeException("Unauthorized to delete this grade");
        }
        gradeRepository.delete(grade);
    }
}
