package com.matei.backend.controller;

import com.matei.backend.dto.request.location.LocationCreationRequestDto;
import com.matei.backend.dto.request.location.LocationUpdateRequestDto;
import com.matei.backend.dto.response.location.LocationPageWithCountResponseDto;
import com.matei.backend.dto.response.location.LocationResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.service.LocationService;
import jakarta.websocket.server.PathParam;
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

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<LocationPageWithCountResponseDto> createLocation(@ModelAttribute LocationCreationRequestDto locationCreationRequestDto,
                                           @PathParam("page") int page,
                                           @PathParam("size") int size) throws IOException {
        return ResponseEntity.ok(locationService.createLocation(locationCreationRequestDto, page, size));
    }

    @GetMapping("/all")
    public ResponseEntity<List<LocationWithoutEventListResponseDto>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLocationById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(locationService.getLocationById(UUID.fromString(id)));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid UUID", HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PatchMapping
    public ResponseEntity<LocationResponseDto> updateLocation(@ModelAttribute LocationUpdateRequestDto locationUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(locationService.updateLocation(locationUpdateRequestDto));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<LocationPageWithCountResponseDto> deleteLocationById(@PathVariable String id,
                                                                               @RequestParam("page") int page,
                                                                              @RequestParam("size") int size) {
        return ResponseEntity.ok(locationService.deleteLocationById(UUID.fromString(id), page, size));
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
