package com.dayflow.service;

import com.dayflow.dto.AuditLogResponse;
import com.dayflow.entity.AuditLog;
import com.dayflow.entity.User;
import com.dayflow.repository.AuditLogRepository;
import com.dayflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void logAction(Long actorId, String action, Long targetId, String description) {
        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;
        User target = targetId != null ? userRepository.findById(targetId).orElse(null) : null;

        AuditLog log = AuditLog.builder()
                .actor(actor)
                .action(action)
                .target(target)
                .description(description)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AuditLogResponse mapToResponse(AuditLog log) {
        String actorName = log.getActor() != null && log.getActor().getProfile() != null ?
                log.getActor().getProfile().getName() : (log.getActor() != null ? log.getActor().getEmail() : "System");
        String targetName = log.getTarget() != null && log.getTarget().getProfile() != null ?
                log.getTarget().getProfile().getName() : (log.getTarget() != null ? log.getTarget().getEmail() : "N/A");

        return AuditLogResponse.builder()
                .id(log.getId())
                .actorUserId(log.getActor() != null ? log.getActor().getId() : null)
                .actorName(actorName)
                .action(log.getAction())
                .targetUserId(log.getTarget() != null ? log.getTarget().getId() : null)
                .targetName(targetName)
                .description(log.getDescription())
                .timestamp(log.getTimestamp())
                .build();
    }
}
