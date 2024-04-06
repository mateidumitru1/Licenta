package com.matei.backend.controller;

import com.matei.backend.dto.request.event.EventCreationRequestDto;
import com.matei.backend.dto.request.event.EventUpdateRequestDto;
import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.event.EventWithTicketTypesResponseDto;
import com.matei.backend.dto.response.event.SelectedEventResponseDto;
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
    public ResponseEntity<List<EventWithoutTicketArtistResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/all/available")
    public ResponseEntity<List<EventWithTicketTypesResponseDto>> getAvailableEvents() {
        return ResponseEntity.ok(eventService.getAvailableEvents());
    }

    @GetMapping("/available/{locationId}")
    public ResponseEntity<List<EventWithoutTicketArtistResponseDto>> getAvailableEventListByLocation(@PathVariable("locationId") String locationId) {
        return ResponseEntity.ok(eventService.getAvailableEventListByLocation(UUID.fromString(locationId)));
    }

    @GetMapping("/{title}")
    public ResponseEntity<EventWithoutTicketArtistResponseDto> getEventByTitle(@PathVariable("title") String title) {
        return ResponseEntity.ok(eventService.getEventByTitle(title));
    }

    @GetMapping
    public ResponseEntity<EventWithTicketTypesResponseDto> getEventById(@PathParam("id") String id) {
        return ResponseEntity.ok(eventService.getEventById(UUID.fromString(id)));
    }

    @PutMapping
    public ResponseEntity<EventWithTicketTypesResponseDto> updateEvent(@ModelAttribute EventUpdateRequestDto eventUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(eventService.updateEvent(eventUpdateRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEventById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/select")
    public ResponseEntity<List<SelectedEventResponseDto>> selectEvent(@RequestBody String eventIdList) {
        return ResponseEntity.ok(eventService.selectEvent(eventIdList));
    }

    @DeleteMapping("/deselect/{eventId}")
    public ResponseEntity<Void> deselectEvent(@PathVariable("eventId") String eventId) {
        eventService.deselectEvent(UUID.fromString(eventId));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/selected")
    public ResponseEntity<List<SelectedEventResponseDto>> getSelectedEvents() {
        return ResponseEntity.ok(eventService.getSelectedEvents());
    }

    @GetMapping("/all-for-selection")
    public ResponseEntity<List<SelectedEventResponseDto>> getAllEventsForSelection() {
        return ResponseEntity.ok(eventService.getAllEventsForSelection());
    }
}