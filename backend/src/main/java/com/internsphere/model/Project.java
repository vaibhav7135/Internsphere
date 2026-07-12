package com.internsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status = "not_submitted"; // "not_assigned", "not_submitted", "under_review", "approved", "revision_needed"
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String githubUrl;
    private String demoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private String submittedAt;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;

    // Mentor-assigned prompt fields
    private String promptTitle;

    @Column(columnDefinition = "TEXT")
    private String promptDescription;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private String deadline;

    // Constructors
    public Project() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getPromptTitle() { return promptTitle; }
    public void setPromptTitle(String promptTitle) { this.promptTitle = promptTitle; }

    public String getPromptDescription() { return promptDescription; }
    public void setPromptDescription(String promptDescription) { this.promptDescription = promptDescription; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
}
