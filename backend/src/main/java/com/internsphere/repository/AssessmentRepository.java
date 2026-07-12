package com.internsphere.repository;

import com.internsphere.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
}
