package com.example.weedshop.service;

import com.example.weedshop.model.User;
import com.example.weedshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // ✅ Save User (Used for Registration & Password Reset)
    public void saveUser(User user) {
        userRepository.save(user);
    }

    // ✅ Find User by Username (For Login)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    // ✅ Check if Username Exists (For Forgot Password)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    // ✅ Find User by Username (Optional usage for password reset)
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
