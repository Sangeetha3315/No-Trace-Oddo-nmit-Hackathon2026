package com.dayflow.config;

import com.dayflow.entity.*;
import com.dayflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository profileRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            createOrUpdateUser("EMP001", "admin@dayflow.com", "Admin@1234", Role.HR, "Sarah Jenkins", "Head of Human Resources", "Human Resources");
            createOrUpdateUser("EMP002", "emp1@dayflow.com", "User@1234", Role.EMPLOYEE, "Alex Rivera", "Senior Full Stack Engineer", "Engineering");
            createOrUpdateUser("EMP003", "emp2@dayflow.com", "User@1234", Role.EMPLOYEE, "Priya Sharma", "UI/UX Designer", "Design");
        } catch (Exception ex) {
            // Ignore duplicate initialization on reboot
        }
    }

    private void createOrUpdateUser(String empId, String email, String rawPassword, Role role, String name, String jobTitle, String dept) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .employeeId(empId)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .isVerified(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            User saved = userRepository.save(user);

            EmployeeProfile profile = EmployeeProfile.builder()
                    .user(saved)
                    .name(name)
                    .jobTitle(jobTitle)
                    .department(dept)
                    .dateOfJoining(LocalDate.now())
                    .build();
            profileRepository.save(profile);

            Payroll payroll = Payroll.builder()
                    .user(saved)
                    .baseSalary(new BigDecimal("85000.00"))
                    .allowances(new BigDecimal("10000.00"))
                    .deductions(new BigDecimal("7000.00"))
                    .effectiveFrom(LocalDate.now())
                    .build();
            payrollRepository.save(payroll);
        } else {
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }
    }
}
