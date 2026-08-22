package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import com.dayflow.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserIdAndDate(Long userId, LocalDate date);
    List<Attendance> findByUserIdOrderByDateDesc(Long userId);
    List<Attendance> findByUserIdAndDateBetweenOrderByDateAsc(Long userId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Attendance> findByStatus(AttendanceStatus status);
    long countByDateAndStatus(LocalDate date, AttendanceStatus status);
}
