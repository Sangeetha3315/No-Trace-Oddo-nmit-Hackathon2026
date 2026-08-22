package com.dayflow.service;

import com.dayflow.dto.DashboardStatsResponse;
import com.dayflow.entity.AttendanceStatus;
import com.dayflow.entity.LeaveStatus;
import com.dayflow.repository.AttendanceRepository;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalEmployees = userRepository.count();

        LocalDate today = LocalDate.now();
        long presentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.PRESENT);
        long absentToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.ABSENT);
        long onLeaveToday = attendanceRepository.countByDateAndStatus(today, AttendanceStatus.LEAVE);
        long pendingLeaveRequests = leaveRequestRepository.countByStatus(LeaveStatus.PENDING);

        Map<String, Long> attendanceTrend = new HashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            long count = attendanceRepository.countByDateAndStatus(d, AttendanceStatus.PRESENT);
            attendanceTrend.put(d.getDayOfWeek().name().substring(0, 3), count);
        }

        Map<String, Long> leaveTypeDistribution = new HashMap<>();
        leaveTypeDistribution.put("PAID", leaveRequestRepository.countByStatus(LeaveStatus.APPROVED));
        leaveTypeDistribution.put("PENDING", pendingLeaveRequests);
        leaveTypeDistribution.put("REJECTED", leaveRequestRepository.countByStatus(LeaveStatus.REJECTED));

        return DashboardStatsResponse.builder()
                .totalEmployees(totalEmployees)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .onLeaveToday(onLeaveToday)
                .pendingLeaveRequests(pendingLeaveRequests)
                .attendanceTrend(attendanceTrend)
                .leaveTypeDistribution(leaveTypeDistribution)
                .build();
    }
}
