package com.internsphere.controller;

import com.internsphere.model.*;
import com.internsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(404).body("User profile not found");
    }

    @PostMapping("/student")
    public ResponseEntity<?> createStudent(@RequestBody UserRequest request) {
        // Validate unique email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Email address already registered");
        }

        User student = new User();
        student.setId("student-" + System.currentTimeMillis());
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(request.getPassword() != null ? request.getPassword() : "password");
        student.setRole("student");
        student.setAvatar(request.getName().split(" ")[0].substring(0, 1).toUpperCase() + 
                         (request.getName().split(" ").length > 1 ? request.getName().split(" ")[1].substring(0, 1).toUpperCase() : ""));
        student.setCollege(request.getCollege());
        student.setPhone(request.getPhone() != null ? request.getPhone() : "+91 98765 00000");
        student.setEnrolledProgram(request.getProgram());
        student.setBatchId(request.getBatch() != null && !request.getBatch().isEmpty() 
            ? request.getBatch() 
            : generateBatchCode(request.getProgram()));
        student.setEnrolledDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        student.setProgress(0);
        student.setAssignmentsCompleted(0);
        student.setTotalAssignments(8);
        student.setAssessmentsPassed(0);
        student.setTotalAssessments(5);
        student.setProjectSubmitted(false);
        student.setStatus("active");

        initializeStudentTasks(student);
        User savedStudent = userRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.status(404).body("User profile not found");
    }

    @PostMapping("/mentor")
    public ResponseEntity<?> createMentor(@RequestBody MentorRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body("Email address already registered");
        }

        User mentor = new User();
        mentor.setId("mentor-" + System.currentTimeMillis());
        mentor.setName(request.getName());
        mentor.setEmail(request.getEmail());
        mentor.setPassword("password");
        mentor.setRole("mentor");
        mentor.setAvatar(request.getName().split(" ")[0].substring(0, 1).toUpperCase() + 
                         (request.getName().split(" ").length > 1 ? request.getName().split(" ")[1].substring(0, 1).toUpperCase() : ""));
        mentor.setEnrolledProgram(request.getExpertise());
        mentor.setCollege(request.getExperience()); // Store experience in college field
        mentor.setPhone("+91 99999 99999");
        mentor.setStatus("active");

        User savedMentor = userRepository.save(mentor);
        return ResponseEntity.ok(savedMentor);
    }

    private String generateBatchCode(String program) {
        StringBuilder prefix = new StringBuilder();
        for (String word : program.split(" ")) {
            if (!word.isEmpty()) {
                prefix.append(word.substring(0, 1).toUpperCase());
            }
        }
        return prefix.toString() + "-B1-2026";
    }

    private void initializeStudentTasks(User student) {
        student.setAssignments(new ArrayList<>());
        student.setAssessments(new ArrayList<>());
        student.setActivities(new ArrayList<>());

        Project proj = new Project();
        proj.setStatus("not_assigned");
        student.setProject(proj);

        Activity act = new Activity();
        act.setId(System.currentTimeMillis());
        act.setText("Welcome to InternSphere! Your batch enrollment is confirmed for " + student.getEnrolledProgram() + ".");
        act.setTime("Just now");
        act.setType("info");
        act.setStudent(student);
        student.getActivities().add(act);
    }

    public static class UserRequest {
        private String name;
        private String email;
        private String password;
        private String college;
        private String phone;
        private String program;
        private String batch;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getCollege() { return college; }
        public void setCollege(String college) { this.college = college; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getProgram() { return program; }
        public void setProgram(String program) { this.program = program; }

        public String getBatch() { return batch; }
        public void setBatch(String batch) { this.batch = batch; }
    }

    public static class MentorRequest {
        private String name;
        private String email;
        private String expertise;
        private String experience;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getExpertise() { return expertise; }
        public void setExpertise(String expertise) { this.expertise = expertise; }

        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }
    }
}
