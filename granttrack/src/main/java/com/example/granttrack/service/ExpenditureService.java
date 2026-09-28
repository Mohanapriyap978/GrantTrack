package com.example.granttrack.service;

import com.example.granttrack.entity.Expenditure;
import com.example.granttrack.entity.GrantApplication;
import com.example.granttrack.repository.ExpenditureRepository;
import com.example.granttrack.repository.GrantApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenditureService {

    private final ExpenditureRepository expenditureRepository;
    private final GrantApplicationRepository grantApplicationRepository;

    public ExpenditureService(
            ExpenditureRepository expenditureRepository,
            GrantApplicationRepository grantApplicationRepository) {

        this.expenditureRepository = expenditureRepository;
        this.grantApplicationRepository = grantApplicationRepository;
    }

    public List<Expenditure> getAllExpenditures() {
        return expenditureRepository.findAll();
    }

    public Expenditure getExpenditureById(Long id) {
        return expenditureRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Expenditure not found"));
    }

    public Expenditure createExpenditure(Expenditure expenditure) {

        if (expenditure.getApplication() == null ||
                expenditure.getApplication().getId() == null) {

            throw new RuntimeException(
                    "Grant application is required");
        }

        Long applicationId =
                expenditure.getApplication().getId();

        // Fetch actual application from database
        GrantApplication application =
                grantApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Grant application not found"));

        // Rule 1: Grant must be APPROVED
        if (!"APPROVED".equalsIgnoreCase(application.getStatus())) {

            throw new RuntimeException(
                    "Expenditure can be added only for an APPROVED grant");
        }

        // Rule 2: Total expenditure must not exceed grant amount
        double existingAmount =
                expenditureRepository.sumByApplicationId(applicationId);

        double newTotal =
                existingAmount + expenditure.getAmount();

        if (newTotal > application.getRequestedAmount()) {

            throw new RuntimeException(
                    "Total expenditure cannot exceed the grant amount");
        }

        // Attach the actual application
        expenditure.setApplication(application);

        return expenditureRepository.save(expenditure);
    }

    public void deleteExpenditure(Long id) {
        expenditureRepository.deleteById(id);
    }
}