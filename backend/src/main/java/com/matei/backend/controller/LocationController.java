package com.matei.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.LocationCreationRequestDto;
import com.matei.backend.dto.request.LocationUpdateRequestDto;
import com.matei.backend.dto.response.LocationResponseDto;
import com.matei.backend.exception.LocationAlreadyExistsException;
import com.matei.backend.exception.LocationNotFoundException;
import com.matei.backend.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<?> createLocation(@ModelAttribute LocationCreationRequestDto locationCreationRequestDto) throws IOException {
        try {
            return ResponseEntity.ok(locationService.createLocation(locationCreationRequestDto));
        } catch (LocationAlreadyExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping
    public ResponseEntity<List<LocationResponseDto>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationById(UUID.fromString(id)));
        } catch (LocationNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/available-events")
    public ResponseEntity<?> getLocationWithAvailableEventsById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationWithAvailableEventsById(UUID.fromString(id)));
        } catch (LocationNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}/unavailable-events")
    public ResponseEntity<?> getLocationWithUnavailableEventsById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationWithUnavailableEventsById(UUID.fromString(id)));
        } catch (LocationNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping
    public ResponseEntity<LocationResponseDto> updateLocation(@ModelAttribute LocationUpdateRequestDto locationUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(locationService.updateLocation(locationUpdateRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocationById(@PathVariable String id) {
        locationService.deleteLocation(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}
