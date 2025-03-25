package com.example.weedshop.controller;

import com.example.weedshop.model.User;
import com.example.weedshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class UserController {
    @Autowired
    private UserService userService;

    // ✅ Register User
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully!"));
    }

    // ✅ Login User
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.findByUsername(user.getUsername());

        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.ok(existingUser);
        }

        return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid username or password"));
    }

    // ✅ Check if Username Exists (For Forgot Password)
    @PostMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    // ✅ Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userService.findUserByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword); // ⚠️ Ideally, hash this before saving
            userService.saveUser(user);
            return ResponseEntity.ok(Collections.singletonMap("message", "Password reset successfully!"));
        }
        return ResponseEntity.status(400).body(Collections.singletonMap("error", "User not found"));
    }
}
