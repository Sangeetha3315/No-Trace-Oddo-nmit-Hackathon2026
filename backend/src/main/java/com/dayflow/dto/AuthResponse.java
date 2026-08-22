package com.dayflow.dto;

import com.dayflow.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long id;
    private String employeeId;
    private String email;
    private String name;
    private Role role;
    private Boolean isVerified;
}
