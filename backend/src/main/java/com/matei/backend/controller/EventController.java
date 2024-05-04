package com.matei.backend.controller;

import com.matei.backend.dto.request.event.EventCreationRequestDto;
import com.matei.backend.dto.request.event.EventUpdateRequestDto;
import com.matei.backend.dto.response.event.*;
import com.matei.backend.entity.User;
import com.matei.backend.service.EventService;
import com.matei.backend.service.auth.AuthenticationService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
    private final AuthenticationService authenticationService;
    private final EventService eventService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<EventPageWithCountResponseDto> createEvent(@ModelAttribute EventCreationRequestDto eventCreationRequestDto,
                                                                     @PathParam("page") int page,
                                                                     @PathParam("size") int size) throws IOException {
        return ResponseEntity.ok(eventService.createEvent(eventCreationRequestDto, page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<EventWithoutTicketArtistResponseDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
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
    public ResponseEntity<EventPageWithCountResponseDto> deleteEventById(@PathVariable("id") String id,
                                                @RequestParam("page") int page,
                                                @RequestParam("size") int size) {
        return ResponseEntity.ok(eventService.deleteEventById(UUID.fromString(id), page, size));
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

    @GetMapping("/list")
    public ResponseEntity<Page<EventWithoutTicketArtistResponseDto>> getEventList(@RequestParam(required = false) String location,
                                                                                  @RequestParam(required = false) String artist,
                                                                                  @RequestParam(required = false) String genre,
                                                                                  @RequestParam(required = false) String startDate,
                                                                                  @RequestParam(required = false) String endDate,
                                                                                  @RequestParam(defaultValue = "0") int page,
                                                                                  @RequestParam(defaultValue = "10") int size) {
        List<String> deserializedLocation = null;
        if(location != null) {
            deserializedLocation = Arrays.stream(location.split(",")).toList();
        }
        List<String> deserializedArtist = null;
        if(artist != null) {
            deserializedArtist = Arrays.stream(artist.split(",")).toList();
        }
        List<String> deserializedGenre = null;
        if(genre != null) {
            deserializedGenre = Arrays.stream(genre.split(",")).toList();
        }
        LocalDate deserializedStartDate = null;
        if(startDate != null) {
            deserializedStartDate = LocalDate.parse(startDate);
        }
        LocalDate deserializedEndDate = null;
        if(endDate != null) {
            deserializedEndDate = LocalDate.parse(endDate);
        }

        return ResponseEntity.ok(eventService.getEventList(deserializedLocation, deserializedArtist, deserializedGenre,
                deserializedStartDate, deserializedEndDate, page, size));
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

    @GetMapping("/home")
    public ResponseEntity<HomeEventsResponseDto> getHomeEvents(){
        if (authenticationService.isAuthenticated()) {
            return ResponseEntity.ok(eventService.getHomeEvents(authenticationService.getUserId().toString()));
        }
        return ResponseEntity.ok(eventService.getHomeEvents(""));
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/me")
    public ResponseEntity<List<EventWithoutTicketArtistResponseDto>> getEventsForUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(eventService.getEventsForUser(user.getId()));
    }
}