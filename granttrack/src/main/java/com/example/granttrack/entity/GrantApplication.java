package com.example.granttrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@Entity
@Table(name = "grant_application")
public class GrantApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Requested amount is required")
    @Positive(message = "Requested amount must be greater than zero")
    private Double requestedAmount;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    @NotNull(message = "Faculty is required")
    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    public GrantApplication() {
    }

    public GrantApplication(String title, String description,
                            Double requestedAmount, String status,
                            LocalDate deadline, Faculty faculty) {
        this.title = title;
        this.description = description;
        this.requestedAmount = requestedAmount;
        this.status = status;
        this.deadline = deadline;
        this.faculty = faculty;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getRequestedAmount() {
        return requestedAmount;
    }

    public void setRequestedAmount(Double requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }
}