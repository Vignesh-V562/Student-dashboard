package com.student.dashboard.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "grades")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private String id;

    @Column(nullable = false)
    private String userUuid;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private Integer credits;

    @Column(nullable = false, length = 2)
    private String gradeLetter;
}
