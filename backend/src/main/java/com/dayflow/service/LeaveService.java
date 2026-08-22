package com.dayflow.service;

import com.dayflow.dto.LeaveApplyRequest;
import com.dayflow.dto.LeaveBalanceDto;
import com.dayflow.dto.LeaveResponse;
import com.dayflow.dto.LeaveReviewRequest;
import com.dayflow.entity.*;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.LeaveRequestRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public LeaveResponse applyForLeave(Long userId, LeaveApplyRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be prior to start date.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LeaveRequest leave = LeaveRequest.builder()
                .user(user)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .remarks(request.getRemarks())
                .status(LeaveStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        LeaveRequest saved = leaveRepository.save(leave);
        auditLogService.logAction(userId, "LEAVE_APPLIED", userId,
                "Applied for " + request.getLeaveType() + " leave from " + request.getStartDate() + " to " + request.getEndDate());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getMyLeaves(Long userId) {
        return leaveRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveBalanceDto getLeaveBalance(Long userId) {
        List<LeaveRequest> userLeaves = leaveRepository.findByUserIdOrderByCreatedAtDesc(userId);

        int paidUsed = 0;
        int sickUsed = 0;
        int unpaidUsed = 0;

        for (LeaveRequest req : userLeaves) {
            if (req.getStatus() == LeaveStatus.APPROVED) {
                int days = (int) ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate()) + 1;
                if (req.getLeaveType() == LeaveType.PAID) paidUsed += days;
                else if (req.getLeaveType() == LeaveType.SICK) sickUsed += days;
                else if (req.getLeaveType() == LeaveType.UNPAID) unpaidUsed += days;
            }
        }

        int paidTotal = 15;
        int sickTotal = 10;

        return LeaveBalanceDto.builder()
                .paidTotal(paidTotal)
                .paidUsed(paidUsed)
                .paidRemaining(Math.max(0, paidTotal - paidUsed))
                .sickTotal(sickTotal)
                .sickUsed(sickUsed)
                .sickRemaining(Math.max(0, sickTotal - sickUsed))
                .unpaidUsed(unpaidUsed)
                .build();
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getAllLeaves(LeaveStatus status) {
        List<LeaveRequest> list = (status != null) ?
                leaveRepository.findByStatusOrderByCreatedAtDesc(status) :
                leaveRepository.findAllByOrderByCreatedAtDesc();

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponse reviewLeave(Long reviewerId, Long leaveId, LeaveReviewRequest request) {
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer user not found"));

        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with ID: " + leaveId));

        leave.setStatus(request.getStatus());
        leave.setReviewedBy(reviewer);
        leave.setReviewerComments(request.getReviewerComments());

        LeaveRequest saved = leaveRepository.save(leave);

        String action = request.getStatus() == LeaveStatus.APPROVED ? "LEAVE_APPROVED" : "LEAVE_REJECTED";
        auditLogService.logAction(reviewerId, action, leave.getUser().getId(),
                "Leave request #" + leaveId + " " + request.getStatus() + " by HR Admin.");

        return mapToResponse(saved);
    }

    private LeaveResponse mapToResponse(LeaveRequest leave) {
        User user = leave.getUser();
        String name = user.getProfile() != null ? user.getProfile().getName() : user.getEmail();

        User reviewer = leave.getReviewedBy();
        String reviewerName = reviewer != null && reviewer.getProfile() != null ?
                reviewer.getProfile().getName() : (reviewer != null ? reviewer.getEmail() : null);

        int totalDays = (int) ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;

        return LeaveResponse.builder()
                .id(leave.getId())
                .userId(user.getId())
                .employeeId(user.getEmployeeId())
                .employeeName(name)
                .leaveType(leave.getLeaveType())
                .startDate(leave.getStartDate())
                .endDate(leave.getEndDate())
                .totalDays(totalDays)
                .remarks(leave.getRemarks())
                .status(leave.getStatus())
                .reviewedByUserId(reviewer != null ? reviewer.getId() : null)
                .reviewerName(reviewerName)
                .reviewerComments(leave.getReviewerComments())
                .createdAt(leave.getCreatedAt())
                .build();
    }
}
