package com.dayflow.dto;

import com.dayflow.entity.LeaveStatus;
import com.dayflow.entity.LeaveType;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveResponse {
    private Long id;
    private Long userId;
    private String employeeId;
    private String employeeName;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private String remarks;
    private LeaveStatus status;
    private Long reviewedByUserId;
    private String reviewerName;
    private String reviewerComments;
    private LocalDateTime createdAt;
}
