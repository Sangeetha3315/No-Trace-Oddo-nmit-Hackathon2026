package com.dayflow.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {
    private Long id;
    private Long actorUserId;
    private String actorName;
    private String action;
    private Long targetUserId;
    private String targetName;
    private String description;
    private LocalDateTime timestamp;
}
