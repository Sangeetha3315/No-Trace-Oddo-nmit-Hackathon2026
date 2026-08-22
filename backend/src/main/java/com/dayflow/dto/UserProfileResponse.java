package com.dayflow.dto;

import com.dayflow.entity.Role;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long userId;
    private String employeeId;
    private String email;
    private Role role;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private String name;
    private String phone;
    private String address;
    private String jobTitle;
    private String department;
    private LocalDate dateOfJoining;
    private String profilePictureUrl;
}
