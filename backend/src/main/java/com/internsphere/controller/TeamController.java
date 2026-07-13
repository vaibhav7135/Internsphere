package com.internsphere.controller;

import com.internsphere.model.Team;
import com.internsphere.model.User;
import com.internsphere.repository.TeamRepository;
import com.internsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    // Create or Update Team
    @PostMapping
    public ResponseEntity<?> saveTeam(@RequestBody Team team) {
        if (team.getName() == null || team.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Team name is required");
        }
        Team saved = teamRepository.save(team);
        return ResponseEntity.ok(saved);
    }

    // Get all teams created by a mentor
    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Team>> getTeamsByMentor(@PathVariable String mentorId) {
        List<Team> teams = teamRepository.findByMentorId(mentorId);
        return ResponseEntity.ok(teams);
    }

    // Get all teams a student belongs to
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Team>> getTeamsByStudent(@PathVariable String studentId) {
        List<Team> studentTeams = teamRepository.findAll().stream()
                .filter(t -> t.getStudentIds().contains(studentId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentTeams);
    }

    // Delete a team
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        if (teamRepository.existsById(id)) {
            teamRepository.deleteById(id);
            return ResponseEntity.ok("Team deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    // Get all teammate profiles for a student
    @GetMapping("/student/{studentId}/teammates")
    public ResponseEntity<List<User>> getTeammates(@PathVariable String studentId) {
        List<Team> studentTeams = teamRepository.findAll().stream()
                .filter(t -> t.getStudentIds().contains(studentId))
                .collect(Collectors.toList());

        List<String> teammateIds = studentTeams.stream()
                .flatMap(t -> t.getStudentIds().stream())
                .filter(id -> !id.equals(studentId))
                .distinct()
                .collect(Collectors.toList());

        List<User> teammates = new ArrayList<>();
        for (String id : teammateIds) {
            userRepository.findById(id).ifPresent(u -> {
                User copy = new User();
                copy.setDbId(u.getDbId());
                copy.setId(u.getId());
                copy.setName(u.getName());
                copy.setEmail(u.getEmail());
                copy.setRole(u.getRole());
                copy.setAvatar(u.getAvatar());
                copy.setCollege(u.getCollege());
                copy.setPhone(u.getPhone());
                copy.setEnrolledProgram(u.getEnrolledProgram());
                copy.setBatchId(u.getBatchId());
                copy.setProgress(u.getProgress());
                copy.setStatus(u.getStatus());
                teammates.add(copy);
            });
        }
        return ResponseEntity.ok(teammates);
    }
}
