package com.example.granttrack.service;

import com.example.granttrack.entity.GrantApplication;
import com.example.granttrack.entity.Stage;
import com.example.granttrack.repository.GrantApplicationRepository;
import com.example.granttrack.repository.StageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StageService {

    private final StageRepository stageRepository;
    private final GrantApplicationRepository grantApplicationRepository;

    public StageService(
            StageRepository stageRepository,
            GrantApplicationRepository grantApplicationRepository) {

        this.stageRepository = stageRepository;
        this.grantApplicationRepository = grantApplicationRepository;
    }

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }

    public Stage getStageById(Long id) {
        return stageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stage not found"));
    }

    public Stage createStage(Stage stage) {
        return stageRepository.save(stage);
    }

    public Stage updateStageStatus(Long stageId, String status) {

        Stage stage = getStageById(stageId);

        GrantApplication application = stage.getApplication();

        if (application == null) {
            throw new RuntimeException("Grant application is required");
        }

        String currentStatus = application.getStatus();

        if ("SUBMITTED".equalsIgnoreCase(currentStatus)
                && "UNDER_REVIEW".equalsIgnoreCase(status)) {

            application.setStatus("UNDER_REVIEW");

        } else if ("UNDER_REVIEW".equalsIgnoreCase(currentStatus)
                && ("APPROVED".equalsIgnoreCase(status)
                || "REJECTED".equalsIgnoreCase(status))) {

            application.setStatus(status);

        } else {
            throw new RuntimeException(
                    "Invalid stage transition from "
                            + currentStatus + " to " + status);
        }

        grantApplicationRepository.save(application);

        stage.setStatus(status);

        return stageRepository.save(stage);
    }

    public void deleteStage(Long id) {
        stageRepository.deleteById(id);
    }
}