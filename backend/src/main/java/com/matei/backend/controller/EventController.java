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

    @GetMapping("/location")
    public ResponseEntity<List<EventResponseDto>> getEventListByPlace(@RequestParam("locationName") String locationName) {
        return ResponseEntity.ok(eventService.getEventListByLocation(locationName));
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
    public ResponseEntity<EventWithTicketTypesResponseDto> getEventById(@PathParam("id") String id) {
        try{
            return ResponseEntity.ok(eventService.getEventById(UUID.fromString(id)));
        } catch (EventNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping
    public ResponseEntity<EventWithTicketTypesResponseDto> updateEvent(@ModelAttribute EventUpdateRequestDto eventUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(eventService.updateEvent(eventUpdateRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEventById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}