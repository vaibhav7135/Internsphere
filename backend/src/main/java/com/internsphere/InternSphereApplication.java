package com.internsphere;

import com.internsphere.model.*;
import com.internsphere.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.ArrayList;

@SpringBootApplication
public class InternSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(InternSphereApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, 
                                     AssignmentRepository assignmentRepository, 
                                     AssessmentRepository assessmentRepository,
                                     ProjectRepository projectRepository,
                                     ActivityRepository activityRepository,
                                     MaterialRepository materialRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                // Clear everything in correct FK order:
                // 1. Children tables (assignments, assessments, activities, materials) first
                assignmentRepository.deleteAll();
                assessmentRepository.deleteAll();
                activityRepository.deleteAll();
                materialRepository.deleteAll();
                // 2. Users next (users hold FK to projects via project_id)
                userRepository.deleteAll();
                // 3. Projects last (now safe, no FK references remain)
                projectRepository.deleteAll();

                // Seed Clean Admin
                User admin = new User();
                admin.setId("admin-1");
                admin.setName("Admin User");
                admin.setEmail("admin@demo.com");
                admin.setPassword("password");
                admin.setRole("admin");
                admin.setAvatar("AU");
                admin.setPhone("+91 99999 00000");
                userRepository.save(admin);

                // Seed Clean Mentor
                User mentor = new User();
                mentor.setId("mentor-1");
                mentor.setName("Dr. Arun Sharma");
                mentor.setEmail("mentor@demo.com");
                mentor.setPassword("password");
                mentor.setRole("mentor");
                mentor.setAvatar("AS");
                mentor.setPhone("+91 98765 12345");
                mentor.setEnrolledProgram("Web Development");
                userRepository.save(mentor);

                // Seed Clean Aarav Patel (Student Demo with 0% progress)
                User aarav = new User();
                aarav.setId("student-1");
                aarav.setName("Aarav Patel");
                aarav.setEmail("student@demo.com");
                aarav.setPassword("password");
                aarav.setRole("student");
                aarav.setAvatar("AP");
                aarav.setCollege("IIT Bombay");
                aarav.setPhone("+91 98765 43210");
                aarav.setEnrolledProgram("Web Development");
                aarav.setBatchId("WD-B1-2026");
                aarav.setEnrolledDate("2026-07-12"); // Starts tomorrow
                aarav.setProgress(0);
                aarav.setAssignmentsCompleted(0);
                aarav.setAssessmentsPassed(0);
                aarav.setStatus("active");
                initializeStudentTasks(aarav);
                userRepository.save(aarav);

                // Seed other clean mock students
                createMockStudent(userRepository, "student-2", "Sneha Reddy", "sneha@example.com", "NIT Trichy", "Data Science", "DS-B2-2026");
                createMockStudent(userRepository, "student-3", "Rahul Gupta", "rahul@example.com", "BITS Pilani", "Web Development", "WD-B1-2026");
                createMockStudent(userRepository, "student-4", "Priya Singh", "priya@example.com", "DTU Delhi", "UI/UX Design", "UX-B1-2026");
            }
        };
    }

    private void createMockStudent(UserRepository repo, String id, String name, String email, String college, String domain, String batch) {
        User s = new User();
        s.setId(id);
        s.setName(name);
        s.setEmail(email);
        s.setPassword("password");
        s.setRole("student");
        s.setAvatar(name.split(" ")[0].substring(0, 1) + name.split(" ")[1].substring(0, 1));
        s.setCollege(college);
        s.setPhone("+91 98765 00000");
        s.setEnrolledProgram(domain);
        s.setBatchId(batch);
        s.setEnrolledDate("2026-07-12"); // Starts tomorrow
        s.setProgress(0);
        s.setAssignmentsCompleted(0);
        s.setAssessmentsPassed(0);
        s.setStatus("active");
        initializeStudentTasks(s);
        repo.save(s);
    }

    private void initializeStudentTasks(User student) {
        // Students start with a clean slate: no assignments or assessments until assigned by mentor
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
}
