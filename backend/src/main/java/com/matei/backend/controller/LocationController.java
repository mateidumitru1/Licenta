package com.matei.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.location.LocationCreationRequestDto;
import com.matei.backend.dto.request.location.LocationUpdateRequestDto;
import com.matei.backend.dto.response.location.LocationPageWithCountResponseDto;
import com.matei.backend.dto.response.location.LocationResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.service.auth.JwtService;
import com.matei.backend.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationService locationService;
    private final ObjectMapper objectMapper;
    private final JwtService jwtService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createLocation(@RequestHeader("Authorization") String jwtToken, @ModelAttribute LocationCreationRequestDto locationCreationRequestDto) throws IOException {
        return ResponseEntity.ok(locationService.createLocation(locationCreationRequestDto, jwtService.extractId(jwtToken)));
    }

    @GetMapping("/available-events")
    public ResponseEntity<List<LocationResponseDto>> getAllLocationsWithAvailableEvents() {
        return ResponseEntity.ok(locationService.getAllLocationsWithAvailableEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationById(UUID.fromString(id)));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/available-events")
    public ResponseEntity<?> getLocationWithAvailableEventsById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationWithAvailableEventsById(UUID.fromString(id)));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/unavailable-events")
    public ResponseEntity<?> getLocationWithUnavailableEventsById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationWithUnavailableEventsById(UUID.fromString(id)));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PatchMapping
    public ResponseEntity<LocationResponseDto> updateLocation(@RequestHeader("Authorization") String jwtToken, @ModelAttribute LocationUpdateRequestDto locationUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(locationService.updateLocation(locationUpdateRequestDto, jwtService.extractId(jwtToken)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocationById(@PathVariable String id) {
        locationService.deleteLocation(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<LocationWithoutEventListResponseDto>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<LocationPageWithCountResponseDto> getAllLocationsPaginatedManage(@RequestParam(defaultValue = "0") int page,
                                                                                           @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(locationService.getLocationsPaginatedManage(page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/filtered")
    public ResponseEntity<LocationPageWithCountResponseDto> getAllLocationsFilteredPaginatedManage(@RequestParam(defaultValue = "0") int page,
                                                                                                   @RequestParam(defaultValue = "5") int size,
                                                                                                   @RequestParam(defaultValue = "") String filter,
                                                                                                   @RequestParam(defaultValue = "") String search) {
        return ResponseEntity.ok(locationService.getLocationsFilteredPaginatedManage(page, size, filter, search));
    }
}
