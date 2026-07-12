package com.internsphere.repository;

import com.internsphere.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    List<Material> findByDomain(String domain);
}
