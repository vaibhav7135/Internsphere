package com.internsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assessment_questions")
public class AssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    @JsonIgnore
    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson;

    private Integer correctAnswer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_db_id")
    @JsonIgnore
    private Assessment assessment;

    @Transient
    @JsonIgnore
    private static final ObjectMapper mapper = new ObjectMapper();

    // Constructors
    public AssessmentQuestion() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    @JsonProperty("options")
    @Transient
    public List<String> getOptions() {
        if (optionsJson == null || optionsJson.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return mapper.readValue(optionsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @JsonProperty("options")
    @Transient
    public void setOptions(List<String> options) {
        try {
            this.optionsJson = mapper.writeValueAsString(options != null ? options : new ArrayList<>());
        } catch (Exception e) {
            this.optionsJson = "[]";
        }
    }

    public Integer getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(Integer correctAnswer) { this.correctAnswer = correctAnswer; }

    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
}
