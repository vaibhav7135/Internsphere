package com.internsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private Integer id; // compatible ID e.g. 1, 2, 3
    private String title;
    private String topic;
    private Integer questionsCount;
    private Integer timeLimit;
    private String status = "locked"; // "locked", "pending", "completed"
    private Integer score;

    @ManyToOne
    @JoinColumn(name = "student_db_id")
    @JsonIgnore
    private User student;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private java.util.List<AssessmentQuestion> questions = new java.util.ArrayList<>();

    // Constructors
    public Assessment() {}

    // Getters and Setters
    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Integer getQuestionsCount() { return questionsCount; }
    public void setQuestionsCount(Integer questionsCount) { this.questionsCount = questionsCount; }

    public Integer getTimeLimit() { return timeLimit; }
    public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public java.util.List<AssessmentQuestion> getQuestions() { return questions; }
    public void setQuestions(java.util.List<AssessmentQuestion> questions) { this.questions = questions; }
}
