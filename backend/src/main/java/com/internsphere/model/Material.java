package com.internsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "materials")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    private String title;
    private Integer week;
    
    @Column(name = "content_type")
    private String contentType; // "Video", "Document", "Link"
    
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description; // Optional description/notes for the resource

    private String domain; // "Web Development", "Data Science", etc.
    
    @Column(name = "upload_date")
    private String uploadDate;

    // Constructors
    public Material() {}

    // Getters and Setters
    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getWeek() { return week; }
    public void setWeek(Integer week) { this.week = week; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getUploadDate() { return uploadDate; }
    public void setUploadDate(String uploadDate) { this.uploadDate = uploadDate; }
}
