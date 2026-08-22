package com.dayflow.controller;

import com.dayflow.dto.PayrollResponse;
import com.dayflow.dto.PayrollUpdateRequest;
import com.dayflow.security.UserPrincipal;
import com.dayflow.service.PayrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/my")
    public ResponseEntity<PayrollResponse> getMyPayroll(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(payrollService.getPayrollByUserId(currentUser.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<List<PayrollResponse>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @PutMapping("/update/{userId}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<PayrollResponse> updatePayroll(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long userId,
            @Valid @RequestBody PayrollUpdateRequest request) {
        return ResponseEntity.ok(payrollService.updatePayroll(currentUser.getId(), userId, request));
    }
}
