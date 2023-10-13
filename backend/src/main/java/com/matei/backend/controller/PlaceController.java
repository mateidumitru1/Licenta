package com.matei.backend.controller;

import com.matei.backend.dto.request.PlaceRequestDto;
import com.matei.backend.dto.response.PlaceResponseDto;
import com.matei.backend.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/places")
public class PlaceController {
    private final PlaceService placeService;

    @PostMapping
    public ResponseEntity<PlaceResponseDto> createPlace(@RequestBody PlaceRequestDto placeRequestDto) {
        return ResponseEntity.ok(placeService.createPlace(placeRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<PlaceResponseDto>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    @GetMapping("/{name}")
    public ResponseEntity<PlaceResponseDto> getPlaceByName(@PathVariable String name) {
        return ResponseEntity.ok(placeService.getPlaceByName(name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaceById(@PathVariable String id) {
        placeService.deletePlaceById(UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}
