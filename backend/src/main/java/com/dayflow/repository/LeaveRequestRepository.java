package com.dayflow.repository;

import com.dayflow.entity.LeaveRequest;
import com.dayflow.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveStatus status);
    List<LeaveRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(LeaveStatus status);
}
