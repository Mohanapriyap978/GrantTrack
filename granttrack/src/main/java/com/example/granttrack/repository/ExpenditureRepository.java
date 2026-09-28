package com.example.granttrack.repository;

import com.example.granttrack.entity.Expenditure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenditureRepository
        extends JpaRepository<Expenditure, Long> {

    @Query("SELECT COALESCE(SUM(e.amount), 0) " +
            "FROM Expenditure e " +
            "WHERE e.application.id = :applicationId")
    double sumByApplicationId(@Param("applicationId") Long applicationId);
}