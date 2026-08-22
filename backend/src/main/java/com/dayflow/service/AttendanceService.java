package com.dayflow.service;

import com.dayflow.dto.AttendanceResponse;
import com.dayflow.entity.Attendance;
import com.dayflow.entity.AttendanceStatus;
import com.dayflow.entity.User;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.exception.UnauthorizedException;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public AttendanceResponse checkIn(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(userId, today);

        if (existing.isPresent()) {
            Attendance att = existing.get();
            if (att.getCheckInTime() != null) {
                throw new BadRequestException("Already checked in for today at " + att.getCheckInTime().toLocalTime());
            }
            att.setCheckInTime(LocalDateTime.now());
            att.setStatus(AttendanceStatus.PRESENT);
            Attendance saved = attendanceRepository.save(att);
            auditLogService.logAction(userId, "ATTENDANCE_CHECK_IN", userId, "User checked in for date " + today);
            return mapToResponse(saved);
        }

        Attendance attendance = Attendance.builder()
                .user(user)
                .date(today)
                .checkInTime(LocalDateTime.now())
                .status(AttendanceStatus.PRESENT)
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        auditLogService.logAction(userId, "ATTENDANCE_CHECK_IN", userId, "User checked in for date " + today);
        return mapToResponse(saved);
    }

    @Transactional
    public AttendanceResponse checkOut(Long userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new BadRequestException("Cannot check out without checking in first for today."));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("Already checked out for today at " + attendance.getCheckOutTime().toLocalTime());
        }

        attendance.setCheckOutTime(LocalDateTime.now());
        Attendance saved = attendanceRepository.save(attendance);
        auditLogService.logAction(userId, "ATTENDANCE_CHECK_OUT", userId, "User checked out for date " + today);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyAttendance(Long userId) {
        return attendanceRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyWeeklyAttendance(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        return attendanceRepository.findByUserIdAndDateBetweenOrderByDateAsc(userId, startOfWeek, endOfWeek).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendance(LocalDate date, Long userId, AttendanceStatus status) {
        List<Attendance> list;
        if (date != null) {
            list = attendanceRepository.findByDate(date);
        } else if (userId != null) {
            list = attendanceRepository.findByUserIdOrderByDateDesc(userId);
        } else if (status != null) {
            list = attendanceRepository.findByStatus(status);
        } else {
            list = attendanceRepository.findAll();
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        User user = attendance.getUser();
        String name = user.getProfile() != null ? user.getProfile().getName() : user.getEmail();

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .userId(user.getId())
                .employeeId(user.getEmployeeId())
                .employeeName(name)
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus())
                .build();
    }
}
