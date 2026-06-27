package com.student.dashboard.server.controller;

import com.student.dashboard.server.entity.Grade;
import com.student.dashboard.server.entity.User;
import com.student.dashboard.server.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<Grade>> getMyGrades(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(gradeService.getGradesForUser(user.getUuid().toString()));
    }

    @PostMapping
    public ResponseEntity<Grade> saveGrade(@AuthenticationPrincipal User user, @RequestBody Grade grade) {
        return ResponseEntity.ok(gradeService.saveGrade(user.getUuid().toString(), grade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@AuthenticationPrincipal User user, @PathVariable String id) {
        gradeService.deleteGrade(id, user.getUuid().toString());
        return ResponseEntity.ok().build();
    }
}
