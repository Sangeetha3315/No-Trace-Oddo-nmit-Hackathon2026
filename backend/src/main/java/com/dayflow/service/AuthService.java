package com.dayflow.service;

import com.dayflow.dto.*;
import com.dayflow.entity.*;
import com.dayflow.exception.BadRequestException;
import com.dayflow.exception.RateLimitExceededException;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.PayrollRepository;
import com.dayflow.repository.UserRepository;
import com.dayflow.security.JwtTokenProvider;
import com.dayflow.security.RateLimiterService;
import com.dayflow.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeProfileRepository profileRepository;
    private final PayrollRepository payrollRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RateLimiterService rateLimiterService;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered.");
        }
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new BadRequestException("Employee ID is already in use.");
        }

        User user = User.builder()
                .employeeId(request.getEmployeeId())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isVerified(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        EmployeeProfile profile = EmployeeProfile.builder()
                .user(savedUser)
                .name(request.getName())
                .jobTitle(request.getJobTitle())
                .department(request.getDepartment())
                .dateOfJoining(LocalDate.now())
                .profilePictureUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .build();

        profileRepository.save(profile);

        Payroll payroll = Payroll.builder()
                .user(savedUser)
                .baseSalary(new BigDecimal("75000.00"))
                .allowances(new BigDecimal("8000.00"))
                .deductions(new BigDecimal("5000.00"))
                .effectiveFrom(LocalDate.now())
                .build();

        payrollRepository.save(payroll);

        auditLogService.logAction(savedUser.getId(), "USER_REGISTERED", savedUser.getId(),
                "New user registered: " + savedUser.getEmail() + " (" + savedUser.getRole() + ")");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .id(savedUser.getId())
                .employeeId(savedUser.getEmployeeId())
                .email(savedUser.getEmail())
                .name(profile.getName())
                .role(savedUser.getRole())
                .isVerified(savedUser.getIsVerified())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String rawPassword = request.getPassword();

        rateLimiterService.loginSucceeded(email);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, rawPassword)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        String name = user.getProfile() != null ? user.getProfile().getName() : user.getEmail();

        auditLogService.logAction(user.getId(), "USER_LOGIN", user.getId(), "User logged in successfully.");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .id(user.getId())
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .name(name)
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token.");
        }

        Long userId = tokenProvider.getUserIdFromJWT(request.getRefreshToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String newAccessToken = tokenProvider.generateAccessToken(authentication);
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId());

        String name = user.getProfile() != null ? user.getProfile().getName() : user.getEmail();

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .id(user.getId())
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .name(name)
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .build();
    }

    @Transactional
    public void verifyEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setIsVerified(true);
        userRepository.save(user);
        auditLogService.logAction(user.getId(), "EMAIL_VERIFIED", user.getId(), "Email verified for: " + email);
    }
}
