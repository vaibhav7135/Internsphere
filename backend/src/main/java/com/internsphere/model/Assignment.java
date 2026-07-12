package com.internsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private Integer id; // compatible ID e.g. 1, 2, 3
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String dueDate;
    private String submittedDate;
    private String status = "pending"; // "pending", "submitted", "graded"
    private Integer marks;
    private Integer totalMarks = 100;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private Integer week;
    private String githubUrl;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "student_db_id")
    @JsonIgnore
    private User student;

    // Constructors
    public Assignment() {}

    // Getters and Setters
    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(String submittedDate) { this.submittedDate = submittedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public Integer getWeek() { return week; }
    public void setWeek(Integer week) { this.week = week; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
}
