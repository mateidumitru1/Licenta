package com.matei.backend.controller;

import com.matei.backend.dto.request.LocationRequestDto;
import com.matei.backend.dto.response.LocationResponseDto;
import com.matei.backend.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
public class LocationController {
    private final LocationService LocationService;

    @PostMapping
    public ResponseEntity<LocationResponseDto> createLocation(@RequestBody LocationRequestDto LocationRequestDto) {
        return ResponseEntity.ok(LocationService.createLocation(LocationRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<LocationResponseDto>> getAllLocations() {
        return ResponseEntity.ok(LocationService.getAllLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationResponseDto> getLocationById(@PathVariable String id) {
        return ResponseEntity.ok(LocationService.getLocationById(UUID.fromString(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocationById(@PathVariable String id) {
        LocationService.deleteLocationById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}
