package com.internsphere.repository;

import com.internsphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(String id);
    List<User> findByRole(String role);
}
