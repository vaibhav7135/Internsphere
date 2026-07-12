package com.internsphere.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private String id; // String ID for compatibility e.g. "student-1"
    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    private String role; // "student", "mentor", "admin"
    private String avatar;
    private String college;
    private String phone;
    
    @Column(name = "enrolled_program")
    private String enrolledProgram; // "Web Development", "Data Science", etc.
    
    @Column(name = "batch_id")
    private String batchId;
    
    @Column(name = "enrolled_date")
    private String enrolledDate;
    
    private Integer progress = 0;
    private Integer assignmentsCompleted = 0;
    private Integer totalAssignments = 8;
    private Integer assessmentsPassed = 0;
    private Integer totalAssessments = 5;
    private Boolean projectSubmitted = false;
    private String status = "active";

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Assignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Assessment> assessments = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities = new ArrayList<>();

    // Constructors
    public User() {}

    // Getters and Setters
    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEnrolledProgram() { return enrolledProgram; }
    public void setEnrolledProgram(String enrolledProgram) { this.enrolledProgram = enrolledProgram; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getEnrolledDate() { return enrolledDate; }
    public void setEnrolledDate(String enrolledDate) { this.enrolledDate = enrolledDate; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public Integer getAssignmentsCompleted() { return assignmentsCompleted; }
    public void setAssignmentsCompleted(Integer assignmentsCompleted) { this.assignmentsCompleted = assignmentsCompleted; }

    public Integer getTotalAssignments() { return totalAssignments; }
    public void setTotalAssignments(Integer totalAssignments) { this.totalAssignments = totalAssignments; }

    public Integer getAssessmentsPassed() { return assessmentsPassed; }
    public void setAssessmentsPassed(Integer assessmentsPassed) { this.assessmentsPassed = assessmentsPassed; }

    public Integer getTotalAssessments() { return totalAssessments; }
    public void setTotalAssessments(Integer totalAssessments) { this.totalAssessments = totalAssessments; }

    public Boolean getProjectSubmitted() { return projectSubmitted; }
    public void setProjectSubmitted(Boolean projectSubmitted) { this.projectSubmitted = projectSubmitted; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<Assignment> getAssignments() { return assignments; }
    public void setAssignments(List<Assignment> assignments) { this.assignments = assignments; }

    public List<Assessment> getAssessments() { return assessments; }
    public void setAssessments(List<Assessment> assessments) { this.assessments = assessments; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public List<Activity> getActivities() { return activities; }
    public void setActivities(List<Activity> activities) { this.activities = activities; }
}
