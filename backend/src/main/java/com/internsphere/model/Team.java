package com.internsphere.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private String name;
    private String description;
    
    @Column(name = "mentor_id")
    private String mentorId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "team_members", joinColumns = @JoinColumn(name = "team_id"))
    @Column(name = "student_id")
    private List<String> studentIds = new ArrayList<>();

    public Team() {}

    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMentorId() { return mentorId; }
    public void setMentorId(String mentorId) { this.mentorId = mentorId; }

    public List<String> getStudentIds() { return studentIds; }
    public void setStudentIds(List<String> studentIds) { this.studentIds = studentIds; }
}
