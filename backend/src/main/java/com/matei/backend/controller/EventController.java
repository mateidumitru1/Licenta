package com.matei.backend.controller;

import com.matei.backend.dto.request.EventRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.exception.EventNotFoundException;
import com.matei.backend.service.EventService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@RequestBody EventRequestDto eventRequestDto) {
        return ResponseEntity.ok(eventService.createEvent(eventRequestDto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/place")
    public ResponseEntity<List<EventResponseDto>> getEventListByPlace(@RequestParam("placeName") String placeName) {
        return ResponseEntity.ok(eventService.getEventListByPlace(placeName));
    }

    @GetMapping("/{title}")
    public ResponseEntity<EventResponseDto> getEventByTitle(@PathVariable("title") String title) {
        try{
            return ResponseEntity.ok(eventService.getEventByTitle(title));
        } catch (EventNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<EventResponseDto> getEventById(@PathParam("id") String id) {
        try{
            return ResponseEntity.ok(eventService.getEventById(UUID.fromString(id)));
        } catch (EventNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping()
    public ResponseEntity<EventResponseDto> updateEvent(@RequestBody EventRequestDto eventRequestDto) {
        return ResponseEntity.ok(eventService.updateEvent(eventRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEventById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}