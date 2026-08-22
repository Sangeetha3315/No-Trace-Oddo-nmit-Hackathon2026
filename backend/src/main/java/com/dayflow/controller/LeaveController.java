package com.dayflow.controller;

import com.dayflow.dto.LeaveApplyRequest;
import com.dayflow.dto.LeaveBalanceDto;
import com.dayflow.dto.LeaveResponse;
import com.dayflow.dto.LeaveReviewRequest;
import com.dayflow.entity.LeaveStatus;
import com.dayflow.security.UserPrincipal;
import com.dayflow.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<LeaveResponse> applyForLeave(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody LeaveApplyRequest request) {
        return ResponseEntity.ok(leaveService.applyForLeave(currentUser.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveResponse>> getMyLeaves(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(leaveService.getMyLeaves(currentUser.getId()));
    }

    @GetMapping("/balance")
    public ResponseEntity<LeaveBalanceDto> getMyLeaveBalance(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(leaveService.getLeaveBalance(currentUser.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<List<LeaveResponse>> getAllLeaves(@RequestParam(required = false) LeaveStatus status) {
        return ResponseEntity.ok(leaveService.getAllLeaves(status));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<LeaveResponse> reviewLeave(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody LeaveReviewRequest request) {
        return ResponseEntity.ok(leaveService.reviewLeave(currentUser.getId(), id, request));
    }
}
