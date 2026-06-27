package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, String> {
    List<Grade> findByUserUuid(String userUuid);
}
