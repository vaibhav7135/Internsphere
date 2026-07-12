package com.internsphere.controller;

import com.internsphere.model.*;
import com.internsphere.repository.UserRepository;
import com.internsphere.repository.MaterialRepository;
import com.internsphere.repository.LearningModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private LearningModuleRepository learningModuleRepository;

    @GetMapping("/{id}/modules")
    public ResponseEntity<?> getStudentModules(@PathVariable String id) {
        Optional<User> studentOpt = userRepository.findById(id);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Student not found");
        }
        User student = studentOpt.get();
        return ResponseEntity.ok(learningModuleRepository.findByDomainOrderByWeekAsc(student.getEnrolledProgram()));
    }

    @GetMapping("/{id}/materials")
    public ResponseEntity<?> getStudentMaterials(@PathVariable String id) {
        Optional<User> studentOpt = userRepository.findById(id);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Student profile not found");
        }
        User student = studentOpt.get();
        return ResponseEntity.ok(materialRepository.findByDomain(student.getEnrolledProgram()));
    }

    @PostMapping("/{id}/assignments/{assignmentId}")
    public ResponseEntity<?> submitAssignment(@PathVariable String id, 
                                              @PathVariable Integer assignmentId, 
                                              @RequestBody SubmissionRequest request) {
        Optional<User> studentOpt = userRepository.findById(id);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Student profile not found");
        }

        User student = studentOpt.get();
        Assignment assignment = null;
        for (Assignment a : student.getAssignments()) {
            if (a.getId().equals(assignmentId)) {
                assignment = a;
                break;
            }
        }

        if (assignment == null) {
            return ResponseEntity.status(404).body("Assignment not found");
        }

        assignment.setStatus("submitted");
        assignment.setSubmittedDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        assignment.setGithubUrl(request.getGithubUrl());
        assignment.setNotes(request.getNotes());

        Activity act = new Activity();
        act.setId(System.currentTimeMillis());
        act.setText("Submitted assignment: " + assignment.getTitle());
        act.setTime("Just now");
        act.setType("assignment");
        act.setStudent(student);
        student.getActivities().add(0, act); // Prepend to list

        recalculateStudentProgress(student);
        User savedStudent = userRepository.save(student);
        return ResponseEntity.ok(copyWithoutPassword(savedStudent));
    }

    @PostMapping("/{id}/assessments/{assessmentId}")
    public ResponseEntity<?> submitAssessment(@PathVariable String id, 
                                              @PathVariable Integer assessmentId, 
                                              @RequestBody QuizRequest request) {
        Optional<User> studentOpt = userRepository.findById(id);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Student profile not found");
        }

        User student = studentOpt.get();
        int foundIdx = -1;
        for (int i = 0; i < student.getAssessments().size(); i++) {
            if (student.getAssessments().get(i).getId().equals(assessmentId)) {
                foundIdx = i;
                break;
            }
        }

        if (foundIdx == -1) {
            return ResponseEntity.status(404).body("Assessment not found");
        }

        Assessment assessment = student.getAssessments().get(foundIdx);
        assessment.setStatus("completed");
        assessment.setScore(request.getScore());

        // Unlock next assessment if passed (score >= 80)
        if (request.getScore() >= 80 && foundIdx + 1 < student.getAssessments().size()) {
            student.getAssessments().get(foundIdx + 1).setStatus("pending");
        }

        Activity act = new Activity();
        act.setId(System.currentTimeMillis());
        act.setText((request.getScore() >= 80 ? "Passed assessment: " : "Attempted assessment: ") + 
                    assessment.getTitle() + " (Score: " + request.getScore() + "%)");
        act.setTime("Just now");
        act.setType("assessment");
        act.setStudent(student);
        student.getActivities().add(0, act);

        recalculateStudentProgress(student);
        User savedStudent = userRepository.save(student);
        return ResponseEntity.ok(copyWithoutPassword(savedStudent));
    }

    @PostMapping("/{id}/project")
    public ResponseEntity<?> submitProject(@PathVariable String id, @RequestBody ProjectRequest request) {
        Optional<User> studentOpt = userRepository.findById(id);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Student profile not found");
        }

        User student = studentOpt.get();
        Project project = student.getProject();
        if (project == null) {
            project = new Project();
        }
        project.setStatus("under_review");
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setGithubUrl(request.getGithubUrl());
        project.setDemoUrl(request.getDemoUrl());
        project.setNotes(request.getNotes());
        project.setSubmittedAt(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        project.setFeedback(null);
        student.setProject(project);
        student.setProjectSubmitted(true);

        Activity act = new Activity();
        act.setId(System.currentTimeMillis());
        act.setText("Submitted final Capstone project: " + request.getTitle());
        act.setTime("Just now");
        act.setType("project");
        act.setStudent(student);
        student.getActivities().add(0, act);

        recalculateStudentProgress(student);
        User savedStudent = userRepository.save(student);
        return ResponseEntity.ok(copyWithoutPassword(savedStudent));
    }

    private void recalculateStudentProgress(User student) {
        int assignmentsCompleted = 0;
        for (Assignment a : student.getAssignments()) {
            if ("graded".equals(a.getStatus()) || "submitted".equals(a.getStatus())) {
                assignmentsCompleted++;
            }
        }

        int assessmentsPassed = 0;
        for (Assessment a : student.getAssessments()) {
            if ("completed".equals(a.getStatus()) && a.getScore() != null && a.getScore() >= 80) {
                assessmentsPassed++;
            }
        }

        float projectWeight = 0.0f;
        if (student.getProject() != null) {
            if ("approved".equals(student.getProject().getStatus())) {
                projectWeight = 1.0f;
            } else if ("under_review".equals(student.getProject().getStatus())) {
                projectWeight = 0.5f;
            }
        }

        int totalTasks = student.getAssignments().size() + student.getAssessments().size() + 1;
        float completedTasks = assignmentsCompleted + assessmentsPassed + projectWeight;
        int newProgress = Math.round((completedTasks / totalTasks) * 100);

        student.setAssignmentsCompleted(assignmentsCompleted);
        student.setAssessmentsPassed(assessmentsPassed);
        student.setProgress(newProgress);
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
        copy.setAssignments(original.getAssignments());
        copy.setAssessments(original.getAssessments());
        copy.setProject(original.getProject());
        copy.setActivities(original.getActivities());
        return copy;
    }

    public static class SubmissionRequest {
        private String githubUrl;
        private String notes;

        public String getGithubUrl() { return githubUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class QuizRequest {
        private Integer score;

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
    }

    public static class ProjectRequest {
        private String title;
        private String description;
        private String githubUrl;
        private String demoUrl;
        private String notes;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getGithubUrl() { return githubUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

        public String getDemoUrl() { return demoUrl; }
        public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
