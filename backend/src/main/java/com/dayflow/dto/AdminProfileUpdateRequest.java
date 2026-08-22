package com.dayflow.dto;

import com.dayflow.entity.Role;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileUpdateRequest {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String jobTitle;
    private String department;
    private LocalDate dateOfJoining;
    private String profilePictureUrl;
    private Role role;
}
