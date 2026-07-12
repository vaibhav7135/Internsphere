package com.internsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_modules")
public class LearningModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private Integer week;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String topics; // Newline-separated list of topics

    private String domain; // "Web Development", "Data Science", etc.

    private String duration; // e.g. "5 hours"

    // Constructors
    public LearningModule() {}

    // Getters and Setters
    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

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
