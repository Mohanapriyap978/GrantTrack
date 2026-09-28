package com.example.granttrack.repository;

import com.example.granttrack.entity.GrantApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GrantApplicationRepository
        extends JpaRepository<GrantApplication, Long> {

    List<GrantApplication> findByDeadlineBetween(
            LocalDate startDate,
            LocalDate endDate
    );
}