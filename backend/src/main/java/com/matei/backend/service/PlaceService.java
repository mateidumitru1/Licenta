package com.matei.backend.service;

import com.matei.backend.dto.request.PlaceRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.PlaceResponseDto;
import com.matei.backend.entity.Place;
import com.matei.backend.exception.PlaceNotFoundException;
import com.matei.backend.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;

    public PlaceResponseDto createPlace(PlaceRequestDto placeRequestDto) {
        var place = Place.builder()
                .id(UUID.randomUUID())
                .name(placeRequestDto.getName())
                .address(placeRequestDto.getAddress())
                .build();

        placeRepository.save(place);

        return PlaceResponseDto.builder()
                .id(place.getId())
                .name(place.getName())
                .address(place.getAddress())
                .imageUrl(place.getImageUrl())
                .build();
    }
    public List<PlaceResponseDto> getAllPlaces() {
        var places = placeRepository.findAll();

        return places.stream()
                .map(place -> PlaceResponseDto.builder()
                        .id(place.getId())
                        .name(place.getName())
                        .address(place.getAddress())
                        .imageUrl(place.getImageUrl())
                        .build())
                .toList();
    }

    public PlaceResponseDto getPlaceById(UUID id) {
        var place = placeRepository.findById(id).orElseThrow(() -> new PlaceNotFoundException("Place not found"));

        return PlaceResponseDto.builder()
                .id(place.getId())
                .name(place.getName())
                .address(place.getAddress())
                .imageUrl(place.getImageUrl())
                .events(place.getEvents().stream().map(event -> EventResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .description(event.getDescription())
                        .shortDescription(event.getShortDescription())
                        .date(event.getDate())
                        .imageUrl(event.getImageUrl())
                        .build()).toList())
                .build();
    }

    public void deletePlaceById(UUID id) {
        placeRepository.deleteById(id);
    }


}
