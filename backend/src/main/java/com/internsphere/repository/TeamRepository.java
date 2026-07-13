package com.internsphere.repository;

import com.internsphere.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByMentorId(String mentorId);
}
