package com.dayflow.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String phone;
    private String address;
    private String profilePictureUrl;
}
