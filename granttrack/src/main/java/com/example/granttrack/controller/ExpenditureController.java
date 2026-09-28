package com.example.granttrack.controller;

import com.example.granttrack.entity.Expenditure;
import com.example.granttrack.service.ExpenditureService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenditures")
public class ExpenditureController {

    private final ExpenditureService expenditureService;

    public ExpenditureController(ExpenditureService expenditureService) {
        this.expenditureService = expenditureService;
    }

    @GetMapping
    public List<Expenditure> getAllExpenditures() {
        return expenditureService.getAllExpenditures();
    }

    @GetMapping("/{id}")
    public Expenditure getExpenditureById(@PathVariable Long id) {
        return expenditureService.getExpenditureById(id);
    }

    @PostMapping
    public Expenditure createExpenditure(
            @Valid @RequestBody Expenditure expenditure) {
        return expenditureService.createExpenditure(expenditure);
    }

    @DeleteMapping("/{id}")
    public String deleteExpenditure(@PathVariable Long id) {
        expenditureService.deleteExpenditure(id);
        return "Expenditure deleted successfully";
    }
}