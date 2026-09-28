package com.example.granttrack.controller;

import com.example.granttrack.entity.GrantApplication;
import com.example.granttrack.service.GrantApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class GrantApplicationController {

    private final GrantApplicationService grantApplicationService;

    public GrantApplicationController(
            GrantApplicationService grantApplicationService) {
        this.grantApplicationService = grantApplicationService;
    }

    @GetMapping
    public List<GrantApplication> getAllApplications() {
        return grantApplicationService.getAllApplications();
    }

    @GetMapping("/near-deadline")
    public List<GrantApplication> getNearDeadlineApplications() {
        return grantApplicationService.getNearDeadlineApplications();
    }

    @GetMapping("/{id}")
    public GrantApplication getApplicationById(@PathVariable Long id) {
        return grantApplicationService.getApplicationById(id);
    }

    @PostMapping
    public GrantApplication createApplication(
            @Valid @RequestBody GrantApplication application) {
        return grantApplicationService.createApplication(application);
    }

    // UPDATE APPLICATION
    @PutMapping("/{id}")
    public GrantApplication updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody GrantApplication application) {

        return grantApplicationService.updateApplication(id, application);
    }

    @PutMapping("/{id}/status")
    public GrantApplication updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return grantApplicationService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        grantApplicationService.deleteApplication(id);
        return "Grant application deleted successfully";
    }
}