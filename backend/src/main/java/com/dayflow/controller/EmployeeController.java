package com.dayflow.controller;

import com.dayflow.dto.AdminProfileUpdateRequest;
import com.dayflow.dto.ProfileUpdateRequest;
import com.dayflow.dto.UserProfileResponse;
import com.dayflow.security.UserPrincipal;
import com.dayflow.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(employeeService.getProfileByUserId(currentUser.getId(), currentUser.getId(), false));
    }

    @PutMapping("/me/update")
    public ResponseEntity<UserProfileResponse> updateSelfProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(employeeService.updateSelfProfile(currentUser.getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getProfileById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_HR") || a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(employeeService.getProfileByUserId(currentUser.getId(), id, isAdmin));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<List<UserProfileResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public ResponseEntity<UserProfileResponse> adminUpdateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody AdminProfileUpdateRequest request) {
        return ResponseEntity.ok(employeeService.adminUpdateProfile(currentUser.getId(), id, request));
    }
}
