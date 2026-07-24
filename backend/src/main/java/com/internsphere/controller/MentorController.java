package com.internsphere.controller;

import com.internsphere.model.*;
import com.internsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mentor")
@CrossOrigin(origins = "*")
public class MentorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private LearningModuleRepository learningModuleRepository;

    // 1. Materials
    @PostMapping("/materials")
    public ResponseEntity<?> uploadMaterial(@RequestBody MaterialRequest request) {
        Material mat = new Material();
        mat.setTitle(request.getTitle());
        mat.setWeek(request.getWeek());
        mat.setContentType(request.getContentType());
        mat.setUrl(request.getUrl());
        mat.setDescription(request.getDescription());
        mat.setDomain(request.getDomain());
        mat.setUploadDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date()));
        
        Material saved = materialRepository.save(mat);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        if (!materialRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Material not found");
        }
        materialRepository.deleteById(id);
        return ResponseEntity.ok("Material deleted");
    }

    @GetMapping("/materials")
    public ResponseEntity<List<Material>> getAllMaterials() {
        return ResponseEntity.ok(materialRepository.findAll());
    }

    // 2. Publish Assignments
    @PostMapping("/assignments")
    public ResponseEntity<?> publishAssignment(@RequestBody AssignmentPublishRequest request) {
        List<User> students = userRepository.findByRoleAndEnrolledProgram("student", request.getDomain());
        int count = 0;
        
        for (User student : students) {
            if (request.getBatchCode() != null && !request.getBatchCode().trim().isEmpty() && !request.getBatchCode().equals(student.getBatchId())) {
                continue;
            }
                Assignment a = new Assignment();
                // Generate relative assignment ID
                int maxId = 0;
                for (Assignment ex : student.getAssignments()) {
                    if (ex.getId() > maxId) maxId = ex.getId();
                }
                a.setId(maxId + 1);
                a.setTitle(request.getTitle());
                a.setDescription(request.getDescription());
                a.setDueDate(request.getDueDate());
                a.setWeek(request.getWeek());
                a.setStatus("pending");
                a.setStudent(student);
                student.getAssignments().add(a);
                userRepository.save(student);
                count++;
        }
        return ResponseEntity.ok("Assignment published to " + count + " students of " + request.getDomain());
    }

    // Edit Published Assignment
    @PutMapping("/assignments")
    public ResponseEntity<?> editAssignment(@RequestBody AssignmentEditRequest request) {
        if (request.getOriginalTitle() == null || request.getOriginalTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Original title is required");
        }

        List<User> students = userRepository.findByRoleAndEnrolledProgram("student", request.getDomain());
        int count = 0;

        for (User student : students) {
            if (request.getBatchCode() != null && !request.getBatchCode().trim().isEmpty() && !request.getBatchCode().equals(student.getBatchId())) {
                continue;
            }
                boolean updated = false;
                for (Assignment a : student.getAssignments()) {
                    if (a.getTitle().equalsIgnoreCase(request.getOriginalTitle())) {
                        a.setTitle(request.getTitle());
                        a.setDescription(request.getDescription());
                        a.setDueDate(request.getDueDate());
                        a.setWeek(request.getWeek());
                        updated = true;
                    }
                }
                if (updated) {
                    userRepository.save(student);
                    count++;
                }
        }
        return ResponseEntity.ok("Assignment updated for " + count + " students");
    }

    // Delete Published Assignment
    @DeleteMapping("/assignments")
    public ResponseEntity<?> deleteAssignment(@RequestParam String title, @RequestParam String domain, @RequestParam(required = false) String batchCode) {
        if (title == null || title.trim().isEmpty() || domain == null || domain.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Title and Domain are required");
        }

        List<User> students = userRepository.findByRoleAndEnrolledProgram("student", domain);
        int count = 0;
        for (User student : students) {
            if (batchCode != null && !batchCode.trim().isEmpty() && !batchCode.equals(student.getBatchId())) {
                continue;
            }
                List<Assignment> toRemove = new ArrayList<>();
                for (Assignment a : student.getAssignments()) {
                    if (a.getTitle().equalsIgnoreCase(title)) {
                        toRemove.add(a);
                    }
                }
                if (!toRemove.isEmpty()) {
                    student.getAssignments().removeAll(toRemove);
                    userRepository.save(student);
                    count += toRemove.size();
                }
        }
        return ResponseEntity.ok("Deleted assignment: " + title);
    }

    // 3. Publish Assessments
    @PostMapping("/assessments")
    public ResponseEntity<?> publishAssessment(@RequestBody AssessmentPublishRequest request) {
        List<User> students = userRepository.findByRoleAndEnrolledProgram("student", request.getDomain());
        int count = 0;

        for (User student : students) {
            if (request.getBatchCode() != null && !request.getBatchCode().trim().isEmpty() && !request.getBatchCode().equals(student.getBatchId())) {
                continue;
            }
                Assessment a = new Assessment();
                int maxId = 0;
                for (Assessment ex : student.getAssessments()) {
                    if (ex.getId() > maxId) maxId = ex.getId();
                }
                a.setId(maxId + 1);
                a.setTitle(request.getTitle());
                a.setTopic(request.getTopic());
                a.setQuestionsCount(request.getQuestionsCount());
                a.setTimeLimit(request.getTimeLimit());
                a.setStatus(student.getAssessments().isEmpty() ? "pending" : "locked");
                a.setStudent(student);

                if (request.getQuestions() != null) {
                    for (QuestionDto qDto : request.getQuestions()) {
                        AssessmentQuestion aq = new AssessmentQuestion();
                        aq.setQuestionText(qDto.getQuestionText());
                        aq.setOptions(qDto.getOptions());
                        aq.setCorrectAnswer(qDto.getCorrectAnswer());
                        aq.setAssessment(a);
                        a.getQuestions().add(aq);
                    }
                }

                student.getAssessments().add(a);
                userRepository.save(student);
                count++;
        }
        return ResponseEntity.ok("Assessment quiz published to " + count + " students of " + request.getDomain());
    }

    // 4. Retrieve Student Submissions
    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionDto>> getSubmissions(@RequestParam(required = false) String batchCode) {
        List<User> students = userRepository.findByRole("student");
        List<SubmissionDto> list = new ArrayList<>();

        for (User student : students) {
            if (batchCode != null && !batchCode.trim().isEmpty() && !batchCode.equals(student.getBatchId())) {
                continue;
            }
            for (Assignment a : student.getAssignments()) {
                if ("submitted".equals(a.getStatus())) {
                    SubmissionDto dto = new SubmissionDto();
                    dto.setDbId(a.getDbId());
                    dto.setStudentId(student.getId());
                    dto.setStudentName(student.getName());
                    dto.setStudentEmail(student.getEmail());
                    dto.setTitle(a.getTitle());
                    dto.setWeek(a.getWeek());
                    dto.setSubmittedDate(a.getSubmittedDate());
                    dto.setGithubUrl(a.getGithubUrl());
                    dto.setNotes(a.getNotes());
                    list.add(dto);
                }
            }
        }
        return ResponseEntity.ok(list);
    }

    // 5. Grade Assignment Submissions
    @PostMapping("/submissions/{dbId}/grade")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long dbId, @RequestBody GradeRequest request) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(dbId);
        if (!assignmentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Submission record not found");
        }

        Assignment a = assignmentOpt.get();
        a.setStatus("graded");
        a.setMarks(request.getMarks());
        a.setFeedback(request.getFeedback());

        User student = a.getStudent();
        
        Activity act = new Activity();
        act.setId(System.currentTimeMillis());
        act.setText("Assignment evaluated: " + a.getTitle() + " (Marks: " + request.getMarks() + "/100)");
        act.setTime("Just now");
        act.setType("assignment");
        act.setStudent(student);
        student.getActivities().add(0, act);

        recalculateStudentProgress(student);
        userRepository.save(student);
        return ResponseEntity.ok("Submission graded successfully");
    }

    // 6. Retrieve Capstone Projects under review
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDto>> getProjects() {
        List<User> students = userRepository.findByRole("student");
        List<ProjectDto> list = new ArrayList<>();

        for (User student : students) {
            Project p = student.getProject();
            if (p != null && "under_review".equals(p.getStatus())) {
                ProjectDto dto = new ProjectDto();
                dto.setStudentDbId(student.getDbId());
                dto.setStudentId(student.getId());
                dto.setStudentName(student.getName());
                dto.setProjectTitle(p.getTitle());
                dto.setProjectDescription(p.getDescription());
                dto.setGithubUrl(p.getGithubUrl());
                dto.setDemoUrl(p.getDemoUrl());
                dto.setNotes(p.getNotes());
                dto.setSubmittedAt(p.getSubmittedAt());
                list.add(dto);
            }
        }
        return ResponseEntity.ok(list);
    }

    // 7. Approve / Reject Capstone Projects
    @PostMapping("/projects/{studentDbId}/review")
    public ResponseEntity<?> reviewProject(@PathVariable Long studentDbId, @RequestBody ProjectReviewRequest request) {
        Optional<User> studentOpt = userRepository.findById(studentDbId);
        if (!studentOpt.isPresent()) {
            return ResponseEntity.status(404).body("Student profile not found");
        }

        User student = studentOpt.get();
        Project p = student.getProject();
        if (p == null) {
            return ResponseEntity.status(400).body("No project submission found to review");
        }

        p.setStatus(request.getStatus()); // "approved", "revision_needed"
        p.setFeedback(request.getFeedback());
        student.setProjectSubmitted("approved".equals(request.getStatus()));

        Activity act = new Activity();
        act.setId(System.currentTimeMillis());
        act.setText("Capstone project reviewed: " + ("approved".equals(request.getStatus()) ? "Approved" : "Revision requested"));
        act.setTime("Just now");
        act.setType("project");
        act.setStudent(student);
        student.getActivities().add(0, act);

        recalculateStudentProgress(student);
        userRepository.save(student);
        return ResponseEntity.ok("Project reviewed successfully");
    }

    // 8. Assign Project Prompt to all students in a domain
    @PostMapping("/projects/assign")
    public ResponseEntity<?> assignProjectPrompt(@RequestBody ProjectAssignRequest request) {
        List<User> students = userRepository.findByRoleAndEnrolledProgram("student", request.getDomain());
        int count = 0;

        for (User student : students) {
            if (request.getBatchCode() != null && !request.getBatchCode().trim().isEmpty() && !request.getBatchCode().equals(student.getBatchId())) {
                continue;
            }
                Project p = student.getProject();
                if (p == null) {
                    p = new Project();
                    student.setProject(p);
                }
                p.setPromptTitle(request.getPromptTitle());
                p.setPromptDescription(request.getPromptDescription());
                p.setRequirements(request.getRequirements());
                p.setDeadline(request.getDeadline());
                p.setStatus("not_submitted");

                Activity act = new Activity();
                act.setId(System.currentTimeMillis() + count);
                act.setText("Capstone project assigned: " + request.getPromptTitle());
                act.setTime("Just now");
                act.setType("project");
                act.setStudent(student);
                student.getActivities().add(0, act);

                userRepository.save(student);
                count++;
        }
        return ResponseEntity.ok("Project prompt assigned to " + count + " students of " + request.getDomain());
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

    // Helper requests & DTO schemas
    public static class MaterialRequest {
        private String title;
        private Integer week;
        private String contentType;
        private String url;
        private String description;
        private String domain;

        public String getTitle() { return title; }
        public Integer getWeek() { return week; }
        public String getContentType() { return contentType; }
        public String getUrl() { return url; }
        public String getDescription() { return description; }
        public String getDomain() { return domain; }
    }

    public static class AssignmentPublishRequest {
        private String title;
        private String description;
        private String dueDate;
        private Integer week;
        private String domain;
        private String batchCode;

        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getDueDate() { return dueDate; }
        public Integer getWeek() { return week; }
        public String getDomain() { return domain; }
        public String getBatchCode() { return batchCode; }
    }

    public static class QuestionDto {
        private String questionText;
        private List<String> options;
        private Integer correctAnswer;

        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }

        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }

        public Integer getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(Integer correctAnswer) { this.correctAnswer = correctAnswer; }
    }

    public static class AssessmentPublishRequest {
        private String title;
        private String topic;
        private Integer questionsCount;
        private Integer timeLimit;
        private String domain;
        private String batchCode;
        private List<QuestionDto> questions;

        public String getTitle() { return title; }
        public String getTopic() { return topic; }
        public Integer getQuestionsCount() { return questionsCount; }
        public Integer getTimeLimit() { return timeLimit; }
        public String getDomain() { return domain; }
        public String getBatchCode() { return batchCode; }
        public List<QuestionDto> getQuestions() { return questions; }
        public void setQuestions(List<QuestionDto> questions) { this.questions = questions; }
    }

    public static class GradeRequest {
        private Integer marks;
        private String feedback;

        public Integer getMarks() { return marks; }
        public String getFeedback() { return feedback; }
    }

    public static class ProjectReviewRequest {
        private String status;
        private String feedback;

        public String getStatus() { return status; }
        public String getFeedback() { return feedback; }
    }

    public static class ProjectAssignRequest {
        private String promptTitle;
        private String promptDescription;
        private String requirements;
        private String deadline;
        private String domain;
        private String batchCode;

        public String getPromptTitle() { return promptTitle; }
        public String getPromptDescription() { return promptDescription; }
        public String getRequirements() { return requirements; }
        public String getDeadline() { return deadline; }
        public String getDomain() { return domain; }
        public String getBatchCode() { return batchCode; }
    }

    public static class SubmissionDto {
        private Long dbId;
        private String studentId;
        private String studentName;
        private String studentEmail;
        private String title;
        private Integer week;
        private String submittedDate;
        private String githubUrl;
        private String notes;

        public Long getDbId() { return dbId; }
        public void setDbId(Long dbId) { this.dbId = dbId; }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public Integer getWeek() { return week; }
        public void setWeek(Integer week) { this.week = week; }

        public String getSubmittedDate() { return submittedDate; }
        public void setSubmittedDate(String submittedDate) { this.submittedDate = submittedDate; }

        public String getGithubUrl() { return githubUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class ProjectDto {
        private Long studentDbId;
        private String studentId;
        private String studentName;
        private String projectTitle;
        private String projectDescription;
        private String githubUrl;
        private String demoUrl;
        private String notes;
        private String submittedAt;

        public Long getStudentDbId() { return studentDbId; }
        public void setStudentDbId(Long studentDbId) { this.studentDbId = studentDbId; }

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public String getProjectTitle() { return projectTitle; }
        public void setProjectTitle(String projectTitle) { this.projectTitle = projectTitle; }

        public String getProjectDescription() { return projectDescription; }
        public void setProjectDescription(String projectDescription) { this.projectDescription = projectDescription; }

        public String getGithubUrl() { return githubUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

        public String getDemoUrl() { return demoUrl; }
        public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public String getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
    }

    // ═══════════════════════════════════════════
    // LEARNING MODULES
    // ═══════════════════════════════════════════

    /** GET all modules for a domain, ordered by week */
    @GetMapping("/modules")
    public ResponseEntity<List<LearningModule>> getModulesByDomain(@RequestParam String domain) {
        return ResponseEntity.ok(learningModuleRepository.findByDomainOrderByWeekAsc(domain));
    }

    /** POST – create or update a module for a given week */
    @PostMapping("/modules")
    public ResponseEntity<?> saveModule(@RequestBody ModuleRequest request) {
        // Upsert: find existing module for this domain+week if any
        List<LearningModule> existing = learningModuleRepository.findByDomainOrderByWeekAsc(request.getDomain());
        LearningModule module = existing.stream()
            .filter(m -> m.getWeek().equals(request.getWeek()))
            .findFirst()
            .orElse(new LearningModule());

        module.setWeek(request.getWeek());
        module.setTitle(request.getTitle());
        module.setDescription(request.getDescription());
        module.setTopics(request.getTopics());
        module.setDomain(request.getDomain());
        module.setDuration(request.getDuration());

        LearningModule saved = learningModuleRepository.save(module);
        return ResponseEntity.ok(saved);
    }

    /** DELETE a module */
    @DeleteMapping("/modules/{id}")
    public ResponseEntity<?> deleteModule(@PathVariable Long id) {
        if (!learningModuleRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Module not found");
        }
        learningModuleRepository.deleteById(id);
        return ResponseEntity.ok("Module deleted");
    }

    public static class ModuleRequest {
        private Integer week;
        private String title;
        private String description;
        private String topics;
        private String domain;
        private String duration;

        public Integer getWeek() { return week; }
        public void setWeek(Integer week) { this.week = week; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getTopics() { return topics; }
        public void setTopics(String topics) { this.topics = topics; }

        public String getDomain() { return domain; }
        public void setDomain(String domain) { this.domain = domain; }

        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
    }

    public static class AssignmentEditRequest {
        private String originalTitle;
        private String title;
        private String description;
        private String dueDate;
        private Integer week;
        private String domain;
        private String batchCode;

        public String getOriginalTitle() { return originalTitle; }
        public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }

        public Integer getWeek() { return week; }
        public void setWeek(Integer week) { this.week = week; }

        public String getDomain() { return domain; }
        public void setDomain(String domain) { this.domain = domain; }
        
        public String getBatchCode() { return batchCode; }
        public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    }
}
