package com.example.weedshop.repository;

import com.example.weedshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Find user by username
    Optional<User> findByUsername(String username);

    // ✅ Find user by email
    Optional<User> findByEmail(String email);

    // ✅ Find all users with a specific role (e.g., ADMIN, USER)
    List<User> findByRole(String role);

    // ✅ Check if a username exists
    boolean existsByUsername(String username);

    // ✅ Check if an email exists
    boolean existsByEmail(String email);
}
