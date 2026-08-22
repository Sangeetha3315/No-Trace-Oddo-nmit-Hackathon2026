package com.dayflow.controller;

import com.dayflow.dto.AttendanceResponse;
import com.dayflow.entity.AttendanceStatus;
import com.dayflow.security.UserPrincipal;
import com.dayflow.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceResponse> checkIn(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.checkIn(currentUser.getId()));
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceResponse> checkOut(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.checkOut(currentUser.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.getMyAttendance(currentUser.getId()));
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<AttendanceResponse>> getMyWeeklyAttendance(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(attendanceService.getMyWeeklyAttendance(currentUser.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) AttendanceStatus status) {
        return ResponseEntity.ok(attendanceService.getAllAttendance(date, userId, status));
    }
}
