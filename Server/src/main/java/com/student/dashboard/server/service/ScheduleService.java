package com.student.dashboard.server.service;

import com.student.dashboard.server.dto.ScheduleEntryDTO;
import com.student.dashboard.server.entity.ScheduleEntry;
import com.student.dashboard.server.repository.ScheduleEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleEntryRepository scheduleEntryRepository;

    @Transactional(readOnly = true)
    public List<ScheduleEntryDTO> getAllSchedule() {
        return scheduleEntryRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ScheduleEntryDTO> getScheduleByDay(String day) {
        return scheduleEntryRepository.findByDayOfWeek(day).stream()
                .map(this::toDto)
                .toList();
    }

    private ScheduleEntryDTO toDto(ScheduleEntry entry) {
        return ScheduleEntryDTO.builder()
                .uuid(entry.getUuid())
                .dayOfWeek(entry.getDayOfWeek())
                .startTime(entry.getStartTime())
                .endTime(entry.getEndTime())
                .subjectName(entry.getSubject().getName())
                .subjectUuid(entry.getSubject().getUuid())
                .room(entry.getRoom())
                .build();
    }
}
