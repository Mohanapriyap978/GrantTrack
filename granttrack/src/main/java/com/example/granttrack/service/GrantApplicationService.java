package com.example.granttrack.service;

import com.example.granttrack.entity.GrantApplication;
import com.example.granttrack.repository.GrantApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GrantApplicationService {

    private final GrantApplicationRepository grantApplicationRepository;

    public GrantApplicationService(
            GrantApplicationRepository grantApplicationRepository) {
        this.grantApplicationRepository = grantApplicationRepository;
    }

    public List<GrantApplication> getAllApplications() {
        return grantApplicationRepository.findAll();
    }

    public GrantApplication getApplicationById(Long id) {
        return grantApplicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Grant application not found"));
    }

    public GrantApplication createApplication(
            GrantApplication application) {
        return grantApplicationRepository.save(application);
    }

    public GrantApplication updateStatus(Long id, String status) {

        GrantApplication application = getApplicationById(id);

        application.setStatus(status);

        return grantApplicationRepository.save(application);
    }

    // UPDATE APPLICATION
    public GrantApplication updateApplication(
            Long id, GrantApplication updatedApplication) {

        GrantApplication application = getApplicationById(id);

        application.setTitle(updatedApplication.getTitle());
        application.setDescription(updatedApplication.getDescription());
        application.setRequestedAmount(
                updatedApplication.getRequestedAmount()
        );
        application.setStatus(updatedApplication.getStatus());
        application.setFaculty(updatedApplication.getFaculty());

        return grantApplicationRepository.save(application);
    }

    public List<GrantApplication> getNearDeadlineApplications() {

        LocalDate today = LocalDate.now();
        LocalDate nextSevenDays = today.plusDays(7);

        return grantApplicationRepository.findByDeadlineBetween(
                today,
                nextSevenDays
        );
    }

    public void deleteApplication(Long id) {
        grantApplicationRepository.deleteById(id);
    }
}