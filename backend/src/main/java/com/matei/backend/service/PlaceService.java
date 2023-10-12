package com.matei.backend.service;

import com.matei.backend.dto.request.PlaceRequestDto;
import com.matei.backend.dto.response.PlaceResponseDto;
import com.matei.backend.entity.Place;
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
                .build();
    }
    public List<PlaceResponseDto> getAllPlaces() {
        var places = placeRepository.findAll();

        return places.stream()
                .map(place -> PlaceResponseDto.builder()
                        .id(place.getId())
                        .name(place.getName())
                        .address(place.getAddress())
                        .build())
                .toList();
    }

    public Optional<PlaceResponseDto> getPlaceById(UUID id) {
        var place = placeRepository.findById(id).orElseThrow();

        return Optional.of(PlaceResponseDto.builder()
                .id(place.getId())
                .name(place.getName())
                .address(place.getAddress())
                .build());
    }

    public void deletePlaceById(UUID id) {
        placeRepository.deleteById(id);
    }
}
