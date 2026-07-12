package com.internsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private Long id; // unique timestamp ID
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    private String time;
    private String type; // "info", "assignment", "assessment", "project"

    @ManyToOne
    @JoinColumn(name = "student_db_id")
    @JsonIgnore
    private User student;

    // Constructors
    public Activity() {}

    // Getters and Setters
    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
}
