package com.dayflow.service;

import com.dayflow.dto.AdminProfileUpdateRequest;
import com.dayflow.dto.ProfileUpdateRequest;
import com.dayflow.dto.UserProfileResponse;
import com.dayflow.entity.EmployeeProfile;
import com.dayflow.entity.User;
import com.dayflow.exception.ResourceNotFoundException;
import com.dayflow.exception.UnauthorizedException;
import com.dayflow.repository.EmployeeProfileRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository profileRepository;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByUserId(Long requesterId, Long targetUserId, boolean isAdmin) {
        if (!isAdmin && !requesterId.equals(targetUserId)) {
            throw new UnauthorizedException("Access Denied: You cannot view profile details of another employee.");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee user not found with ID: " + targetUserId));

        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateSelfProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EmployeeProfile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> EmployeeProfile.builder().user(user).build());

        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getProfilePictureUrl() != null) profile.setProfilePictureUrl(request.getProfilePictureUrl());

        profileRepository.save(profile);
        auditLogService.logAction(userId, "SELF_PROFILE_UPDATE", userId, "Employee updated personal details (phone/address/avatar).");

        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse adminUpdateProfile(Long adminUserId, Long targetUserId, AdminProfileUpdateRequest request) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee user not found with ID: " + targetUserId));

        EmployeeProfile profile = profileRepository.findByUserId(targetUserId)
                .orElseGet(() -> EmployeeProfile.builder().user(targetUser).build());

        if (request.getName() != null) profile.setName(request.getName());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getJobTitle() != null) profile.setJobTitle(request.getJobTitle());
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment());
        if (request.getDateOfJoining() != null) profile.setDateOfJoining(request.getDateOfJoining());
        if (request.getProfilePictureUrl() != null) profile.setProfilePictureUrl(request.getProfilePictureUrl());

        if (request.getEmail() != null) targetUser.setEmail(request.getEmail());
        if (request.getRole() != null) targetUser.setRole(request.getRole());

        userRepository.save(targetUser);
        profileRepository.save(profile);

        auditLogService.logAction(adminUserId, "ADMIN_PROFILE_UPDATE", targetUserId,
                "HR Admin updated full employee profile for ID: " + targetUserId);

        return mapToProfileResponse(targetUser);
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllEmployees() {
        return userRepository.findAll().stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    public UserProfileResponse mapToProfileResponse(User user) {
        EmployeeProfile profile = user.getProfile();

        return UserProfileResponse.builder()
                .userId(user.getId())
                .employeeId(user.getEmployeeId())
                .email(user.getEmail())
                .role(user.getRole())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .name(profile != null ? profile.getName() : user.getEmail())
                .phone(profile != null ? profile.getPhone() : "")
                .address(profile != null ? profile.getAddress() : "")
                .jobTitle(profile != null ? profile.getJobTitle() : "Employee")
                .department(profile != null ? profile.getDepartment() : "General")
                .dateOfJoining(profile != null ? profile.getDateOfJoining() : user.getCreatedAt().toLocalDate())
                .profilePictureUrl(profile != null ? profile.getProfilePictureUrl() : "")
                .build();
    }
}
