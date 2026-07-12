package com.internsphere.repository;

import com.internsphere.model.LearningModule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningModuleRepository extends JpaRepository<LearningModule, Long> {
    List<LearningModule> findByDomainOrderByWeekAsc(String domain);
    boolean existsByDomainAndWeek(String domain, Integer week);
}
