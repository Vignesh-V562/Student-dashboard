package com.student.dashboard.server.repository;

import com.student.dashboard.server.entity.ScheduleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleEntryRepository extends JpaRepository<ScheduleEntry, Long> {
    List<ScheduleEntry> findByDayOfWeek(String dayOfWeek);
}
