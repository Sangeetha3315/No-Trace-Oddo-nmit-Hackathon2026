package com.dayflow.service;

import com.dayflow.dto.PayrollResponse;
import com.dayflow.dto.PayrollUpdateRequest;
import com.dayflow.entity.Payroll;
import com.dayflow.entity.User;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.PayrollRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public PayrollResponse getPayrollByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Payroll payroll = payrollRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not configured for employee ID: " + userId));

        return mapToResponse(payroll);
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getAllPayrolls() {
        return payrollRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PayrollResponse updatePayroll(Long adminId, Long targetUserId, PayrollUpdateRequest request) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + targetUserId));

        Payroll payroll = payrollRepository.findByUserId(targetUserId)
                .orElseGet(() -> Payroll.builder().user(targetUser).build());

        payroll.setBaseSalary(request.getBaseSalary());
        payroll.setAllowances(request.getAllowances());
        payroll.setDeductions(request.getDeductions());
        payroll.setEffectiveFrom(request.getEffectiveFrom());

        Payroll saved = payrollRepository.save(payroll);
        auditLogService.logAction(adminId, "PAYROLL_UPDATED", targetUserId,
                "HR Admin updated salary structure for employee ID: " + targetUserId);

        return mapToResponse(saved);
    }

    private PayrollResponse mapToResponse(Payroll payroll) {
        User user = payroll.getUser();
        String name = user.getProfile() != null ? user.getProfile().getName() : user.getEmail();

        BigDecimal netSalary = payroll.getBaseSalary()
                .add(payroll.getAllowances())
                .subtract(payroll.getDeductions());

        return PayrollResponse.builder()
                .id(payroll.getId())
                .userId(user.getId())
                .employeeId(user.getEmployeeId())
                .employeeName(name)
                .baseSalary(payroll.getBaseSalary())
                .allowances(payroll.getAllowances())
                .deductions(payroll.getDeductions())
                .netSalary(netSalary)
                .effectiveFrom(payroll.getEffectiveFrom())
                .build();
    }
}
