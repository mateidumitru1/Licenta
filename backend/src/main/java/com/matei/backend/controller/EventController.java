package com.matei.backend.controller;

import com.matei.backend.dto.request.EventCreationRequestDto;
import com.matei.backend.dto.request.EventUpdateRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.EventWithTicketTypesResponseDto;
import com.matei.backend.exception.EventNotFoundException;
import com.matei.backend.service.EventService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventWithTicketTypesResponseDto> createEvent(@ModelAttribute EventCreationRequestDto eventCreationRequestDto) throws IOException {
        return ResponseEntity.ok(eventService.createEvent(eventCreationRequestDto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<EventWithTicketTypesResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/all/available")
    public ResponseEntity<List<EventWithTicketTypesResponseDto>> getAvailableEvents() {
        return ResponseEntity.ok(eventService.getAvailableEvents());
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<?> getEventListByLocation(@PathVariable("locationId") String locationId) {
        return ResponseEntity.ok(eventService.getEventListByLocation(UUID.fromString(locationId)));
    }


    @GetMapping("/available/{locationId}")
    public ResponseEntity<?> getAvailableEventListByLocation(@PathVariable("locationId") String locationId) {
        return ResponseEntity.ok(eventService.getAvailableEventListByLocation(UUID.fromString(locationId)));
    }

    @GetMapping("/{title}")
    public ResponseEntity<EventResponseDto> getEventByTitle(@PathVariable("title") String title) {
        return ResponseEntity.ok(eventService.getEventByTitle(title));
    }

    @GetMapping
    public ResponseEntity<EventWithTicketTypesResponseDto> getEventById(@PathParam("id") String id) {
        return ResponseEntity.ok(eventService.getEventById(UUID.fromString(id)));
    }

    @PatchMapping
    public ResponseEntity<?> updateEvent(@ModelAttribute EventUpdateRequestDto eventUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(eventService.updateEvent(eventUpdateRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEventById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}