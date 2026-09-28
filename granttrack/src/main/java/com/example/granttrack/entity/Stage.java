package com.example.granttrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "stage")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Stage name is required")
    private String name;

    @NotBlank(message = "Stage status is required")
    private String status;

    private String remarks;

    @NotNull(message = "Application is required")
    @ManyToOne
    @JoinColumn(name = "application_id")
    private GrantApplication application;

    public Stage() {
    }

    public Stage(String name, String status, String remarks,
                 GrantApplication application) {
        this.name = name;
        this.status = status;
        this.remarks = remarks;
        this.application = application;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public GrantApplication getApplication() {
        return application;
    }

    public void setApplication(GrantApplication application) {
        this.application = application;
    }
}