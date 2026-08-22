package com.dayflow.dto;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalEmployees;
    private long presentToday;
    private long absentToday;
    private long onLeaveToday;
    private long pendingLeaveRequests;
    private Map<String, Long> attendanceTrend;
    private Map<String, Long> leaveTypeDistribution;
}
