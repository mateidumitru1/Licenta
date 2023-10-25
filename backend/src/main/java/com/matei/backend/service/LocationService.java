package com.matei.backend.service;

import com.matei.backend.dto.request.LocationRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.LocationResponseDto;
import com.matei.backend.exception.LocationNotFoundException;
import com.matei.backend.repository.LocationRepository;
import com.matei.backend.entity.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;

    public LocationResponseDto createLocation(LocationRequestDto locationRequestDto) {
        var location = locationRepository.save(Location.builder()
                .id(UUID.randomUUID())
                .name(locationRequestDto.getName())
                .address(locationRequestDto.getAddress())
                .build());

        return LocationResponseDto.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .imageUrl(location.getImageUrl())
                .build();
    }
    public List<LocationResponseDto> getAllLocations() {
        var locations = locationRepository.findAll();

        return locations.stream()
                .map(location -> LocationResponseDto.builder()
                        .id(location.getId())
                        .name(location.getName())
                        .address(location.getAddress())
                        .imageUrl(location.getImageUrl())
                        .build())
                .toList();
    }

    public LocationResponseDto getLocationById(UUID id) {
        var location = locationRepository.findById(id).orElseThrow(() -> new LocationNotFoundException("location not found"));

        return LocationResponseDto.builder()
                .id(location.getId())
                .name(location.getName())
                .address(location.getAddress())
                .imageUrl(location.getImageUrl())
                .events(location.getEvents().stream().map(event -> EventResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .description(event.getDescription())
                        .shortDescription(event.getShortDescription())
                        .date(event.getDate())
                        .imageUrl(event.getImageUrl())
                        .build()).toList())
                .build();
    }

    public void deleteLocationById(UUID id) {
        locationRepository.deleteById(id);
    }


}
