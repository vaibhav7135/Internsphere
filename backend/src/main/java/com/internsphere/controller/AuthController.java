package com.internsphere.controller;

import com.internsphere.model.User;
import com.internsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                // Update last login timestamp in IST (Asia/Kolkata) with 12-hour AM/PM format
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm a");
                sdf.setTimeZone(java.util.TimeZone.getTimeZone("Asia/Kolkata"));
                String currentTimestamp = sdf.format(new java.util.Date());
                user.setLastLogin(currentTimestamp);
                userRepository.save(user);

                // Return user details without password
                User responseUser = copyWithoutPassword(user);
                return ResponseEntity.ok(responseUser);
            }
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    private User copyWithoutPassword(User original) {
        User copy = new User();
        copy.setDbId(original.getDbId());
        copy.setId(original.getId());
        copy.setName(original.getName());
        copy.setEmail(original.getEmail());
        copy.setRole(original.getRole());
        copy.setAvatar(original.getAvatar());
        copy.setCollege(original.getCollege());
        copy.setPhone(original.getPhone());
        copy.setEnrolledProgram(original.getEnrolledProgram());
        copy.setBatchId(original.getBatchId());
        copy.setEnrolledDate(original.getEnrolledDate());
        copy.setProgress(original.getProgress());
        copy.setAssignmentsCompleted(original.getAssignmentsCompleted());
        copy.setTotalAssignments(original.getTotalAssignments());
        copy.setAssessmentsPassed(original.getAssessmentsPassed());
        copy.setTotalAssessments(original.getTotalAssessments());
        copy.setProjectSubmitted(original.getProjectSubmitted());
        copy.setStatus(original.getStatus());
        copy.setLastLogin(original.getLastLogin());
        copy.setAssignments(original.getAssignments());
        copy.setAssessments(original.getAssessments());
        copy.setProject(original.getProject());
        copy.setActivities(original.getActivities());
        return copy;
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
