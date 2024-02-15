package com.matei.backend.controller;

import com.matei.backend.dto.request.TopEventCreationRequestDto;
import com.matei.backend.dto.request.TopEventUpdateRequestDto;
import com.matei.backend.exception.TopEventAlreadyExistsException;
import com.matei.backend.exception.TopEventNotFoundException;
import com.matei.backend.service.TopEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/top-events")
public class TopEventController {
    private final TopEventService topEventService;

    @PostMapping
    public ResponseEntity<?> createTopEvent(@RequestBody TopEventCreationRequestDto topEventCreationRequestDto) {
        try {
            return ResponseEntity.ok(topEventService.createTopEvent(topEventCreationRequestDto));
        } catch (TopEventAlreadyExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping
    public ResponseEntity<?> getTopEvents() {
        return ResponseEntity.ok(topEventService.getTopEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTopEventById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(topEventService.getTopEventById(UUID.fromString(id)));
        } catch (TopEventNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopEvent(@PathVariable String id, @RequestBody TopEventUpdateRequestDto topEventUpdateRequestDto) {
        try {
            return ResponseEntity.ok(topEventService.updateTopEvent(UUID.fromString(id), topEventUpdateRequestDto));
        } catch (TopEventNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopEventById(@PathVariable String id) {
        topEventService.deleteTopEventById(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }
}
