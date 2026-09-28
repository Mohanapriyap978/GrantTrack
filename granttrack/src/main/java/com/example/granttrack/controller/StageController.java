package com.example.granttrack.controller;

import com.example.granttrack.entity.Stage;
import com.example.granttrack.service.StageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
public class StageController {

    private final StageService stageService;

    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    @GetMapping
    public List<Stage> getAllStages() {
        return stageService.getAllStages();
    }

    @GetMapping("/{id}")
    public Stage getStageById(@PathVariable Long id) {
        return stageService.getStageById(id);
    }

    @PostMapping
    public Stage createStage(@Valid @RequestBody Stage stage) {
        return stageService.createStage(stage);
    }

    @PutMapping("/{id}/status")
    public Stage updateStageStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return stageService.updateStageStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteStage(@PathVariable Long id) {
        stageService.deleteStage(id);
        return "Stage deleted successfully";
    }
}