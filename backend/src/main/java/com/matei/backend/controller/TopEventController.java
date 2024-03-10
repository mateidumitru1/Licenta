package com.matei.backend.controller;

import com.matei.backend.dto.request.topEvent.TopEventCreationRequestDto;
import com.matei.backend.dto.request.topEvent.TopEventUpdateRequestDto;
import com.matei.backend.service.TopEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/top-events")
public class TopEventController {
    private final TopEventService topEventService;

    @PostMapping
    public ResponseEntity<?> createTopEvent(@RequestBody List<TopEventCreationRequestDto> topEventCreationRequestDtoList) {
        return ResponseEntity.ok(topEventService.createTopEventList(topEventCreationRequestDtoList));
    }

    @GetMapping
    public ResponseEntity<?> getTopEvents() {
        return ResponseEntity.ok(topEventService.getTopEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTopEventById(@PathVariable String id) {
        return ResponseEntity.ok(topEventService.getTopEventById(UUID.fromString(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopEvent(@PathVariable String id, @RequestBody TopEventUpdateRequestDto topEventUpdateRequestDto) {
        return ResponseEntity.ok(topEventService.updateTopEvent(UUID.fromString(id), topEventUpdateRequestDto));
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopEventById(@PathVariable String id) {
        topEventService.deleteTopEventById(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }
}
