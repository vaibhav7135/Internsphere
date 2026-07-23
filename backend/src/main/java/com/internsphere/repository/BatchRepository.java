package com.internsphere.repository;

import com.internsphere.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByDomain(String domain);
    List<Batch> findByMentorId(String mentorId);
    Optional<Batch> findByBatchCode(String batchCode);
}
