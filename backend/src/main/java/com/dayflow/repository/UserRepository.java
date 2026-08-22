package com.dayflow.repository;

import com.dayflow.entity.Role;
import com.dayflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
    Boolean existsByEmail(String email);
    Boolean existsByEmployeeId(String employeeId);
    List<User> findByRole(Role role);
}
