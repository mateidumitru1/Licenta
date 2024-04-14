package com.matei.backend.controller;

import com.matei.backend.dto.request.event.EventCreationRequestDto;
import com.matei.backend.dto.request.event.EventUpdateRequestDto;
import com.matei.backend.dto.response.event.*;
import com.matei.backend.entity.User;
import com.matei.backend.service.EventService;
import com.matei.backend.service.auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final JwtService jwtService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<EventResponseDto> createEvent(@ModelAttribute EventCreationRequestDto eventCreationRequestDto) throws IOException {
        return ResponseEntity.ok(eventService.createEvent(eventCreationRequestDto));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<EventWithoutTicketArtistResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all/available")
    public ResponseEntity<List<EventResponseDto>> getAvailableEvents() {
        return ResponseEntity.ok(eventService.getAvailableEvents());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/available/{locationId}")
    public ResponseEntity<List<EventWithoutTicketArtistResponseDto>> getAvailableEventListByLocation(@PathVariable("locationId") String locationId) {
        return ResponseEntity.ok(eventService.getAvailableEventListByLocation(UUID.fromString(locationId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDto> getEventById(@PathVariable("id") String id){
        return ResponseEntity.ok(eventService.getEventById(UUID.fromString(id)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping
    public ResponseEntity<EventResponseDto> updateEvent(@ModelAttribute EventUpdateRequestDto eventUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(eventService.updateEvent(eventUpdateRequestDto));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable("id") String id) {
        eventService.deleteEventById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/select")
    public ResponseEntity<List<SelectedEventResponseDto>> selectEvent(@RequestBody String eventIdList) {
        return ResponseEntity.ok(eventService.selectEvent(eventIdList));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deselect/{eventId}")
    public ResponseEntity<Void> deselectEvent(@PathVariable("eventId") String eventId) {
        eventService.deselectEvent(UUID.fromString(eventId));
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/selected")
    public ResponseEntity<List<SelectedEventResponseDto>> getSelectedEvents() {
        return ResponseEntity.ok(eventService.getSelectedEvents());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all-for-selection")
    public ResponseEntity<List<SelectedEventResponseDto>> getAllEventsForSelection() {
        return ResponseEntity.ok(eventService.getAllEventsForSelection());
    }

    @GetMapping("/location/{locationId}/initial")
    public ResponseEntity<Page<EventWithoutTicketArtistResponseDto>> getInitialEvents(@PathVariable String locationId) {
        return ResponseEntity.ok(eventService.getInitialEvents(UUID.fromString(locationId)));
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<Page<EventWithoutAllResponseDto>> getMoreRecentEvents(@PathVariable String locationId,
                                                                                @RequestParam(defaultValue = "1") int page,
                                                                                @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getMoreRecentEvents(UUID.fromString(locationId), page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<EventPageWithCountResponseDto> getAllEventsPaginatedManage(@RequestParam(defaultValue = "0") int page,
                                                                                     @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getAllEventsPaginatedManage(page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/filtered")
    public ResponseEntity<EventPageWithCountResponseDto> getAllEventsFilteredPaginatedManage(@RequestParam(defaultValue = "0") int page,
                                                                                             @RequestParam(defaultValue = "5") int size,
                                                                                             @RequestParam(defaultValue = "") String filter,
                                                                                             @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(eventService.getAllEventsFilteredPaginatedManage(page, size, filter, search));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/mappings")
    public ResponseEntity<List<EventResponseDto>> getEventGenreMappings() {
        return ResponseEntity.ok(eventService.createMappingsForExistingEvents());
    }

    @GetMapping("/home")
    public ResponseEntity<HomeEventsResponseDto> getHomeEvents(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok(eventService.getHomeEvents(""));
        }
        else {
            User user = (User) authentication.getPrincipal();
            return ResponseEntity.ok(eventService.getHomeEvents(user.getId().toString()));
        }
    }
}