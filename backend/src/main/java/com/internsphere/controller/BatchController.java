package com.internsphere.controller;

import com.internsphere.model.Batch;
import com.internsphere.model.User;
import com.internsphere.repository.BatchRepository;
import com.internsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "*")
public class BatchController {

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Batch>> getBatchesByDomain(@RequestParam String domain) {
        return ResponseEntity.ok(batchRepository.findByDomain(domain));
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<Batch>> getBatchesByMentor(@PathVariable String mentorId) {
        return ResponseEntity.ok(batchRepository.findByMentorId(mentorId));
    }

    @PostMapping
    public ResponseEntity<Batch> createBatch(@RequestBody Batch request) {
        String domain = request.getDomain();
        String prefix = Arrays.stream(domain.split("\\s+"))
                .map(word -> word.replaceAll("[^a-zA-Z]", ""))
                .filter(word -> !word.isEmpty())
                .map(word -> word.substring(0, 1).toUpperCase())
                .collect(Collectors.joining());

        List<Batch> existing = batchRepository.findByDomain(domain);
        int count = existing.size() + 1;
        int year = LocalDate.now().getYear();

        String batchCode = prefix + "-B" + count + "-" + year;
        request.setBatchCode(batchCode);

        LocalDate startDate = LocalDate.parse(request.getStartDate());
        LocalDate today = LocalDate.now();
        if (startDate.isBefore(today) || startDate.isEqual(today)) {
            request.setStatus("active");
        } else {
            request.setStatus("upcoming");
        }
        
        request.setCreatedAt(today.toString());

        Batch saved = batchRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{batchCode}/assign")
    public ResponseEntity<?> assignBatch(@PathVariable String batchCode, @RequestBody Map<String, List<String>> request) {
        List<String> studentIds = request.get("studentIds");
        if (studentIds == null || studentIds.isEmpty()) {
            return ResponseEntity.badRequest().body("No studentIds provided");
        }

        int count = 0;
        for (String id : studentIds) {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setBatchId(batchCode);
                userRepository.save(user);
                count++;
            }
        }
        return ResponseEntity.ok("Assigned " + count + " students to batch " + batchCode);
    }

    @DeleteMapping("/{batchCode}")
    public ResponseEntity<?> deleteBatch(@PathVariable String batchCode) {
        Optional<Batch> batchOpt = batchRepository.findByBatchCode(batchCode);
        if (!batchOpt.isPresent()) {
            return ResponseEntity.status(404).body("Batch not found");
        }

        List<User> students = userRepository.findByRoleAndBatchId("student", batchCode);
        for (User student : students) {
            student.setBatchId(null);
            userRepository.save(student);
        }

        batchRepository.delete(batchOpt.get());
        return ResponseEntity.ok("Deleted batch " + batchCode);
    }

    @GetMapping("/{batchCode}/students")
    public ResponseEntity<List<User>> getStudentsInBatch(@PathVariable String batchCode) {
        return ResponseEntity.ok(userRepository.findByRoleAndBatchId("student", batchCode));
    }
}
