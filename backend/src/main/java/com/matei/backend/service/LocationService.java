package com.matei.backend.service;

import com.matei.backend.dto.request.LocationCreationRequestDto;
import com.matei.backend.dto.request.LocationUpdateRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.LocationResponseDto;
import com.matei.backend.exception.LocationAlreadyExistsException;
import com.matei.backend.exception.LocationNotFoundException;
import com.matei.backend.repository.LocationRepository;
import com.matei.backend.entity.Location;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final ImageService imageService;
    private final ModelMapper modelMapper;

    public LocationResponseDto createLocation(LocationCreationRequestDto locationCreationRequestDto) throws IOException {
        if(locationRepository.findByName(locationCreationRequestDto.getName()).isPresent()) {
            throw new LocationAlreadyExistsException("Location already exists");
        }

        var location = locationRepository.save(modelMapper.map(locationCreationRequestDto, Location.class));

        return modelMapper.map(location, LocationResponseDto.class);
    }
    public List<LocationResponseDto> getAllLocations() {
        var locations = locationRepository.findAll();

        return locations.stream()
                .map(location -> modelMapper.map(location, LocationResponseDto.class))
                .toList();
    }

    public LocationResponseDto getLocationById(UUID id) {
        var location = locationRepository.findById(id).orElseThrow(() -> new LocationNotFoundException("location not found"));

        return modelMapper.map(location, LocationResponseDto.class);
    }

    public LocationResponseDto updateLocation(LocationUpdateRequestDto updatedLocation) throws IOException {
        String imageUrl = updatedLocation.getImageUrl();
        if(updatedLocation.getImage() != null) {
            if(imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("location-images", updatedLocation.getImage());
        }

        var location = locationRepository.findById(updatedLocation.getId()).orElseThrow(() -> new LocationNotFoundException("location not found"));

        if(!Objects.equals(imageUrl, location.getImageUrl())) {
            location.setImageUrl(imageUrl);
        }
        if(!Objects.equals(updatedLocation.getName(), location.getName())) {
            location.setName(updatedLocation.getName());
        }
        if(!Objects.equals(updatedLocation.getAddress(), location.getAddress())) {
            location.setAddress(updatedLocation.getAddress());
        }

        locationRepository.save(location);

        return modelMapper.map(location, LocationResponseDto.class);
    }

    public void deleteLocation(UUID id) {
        locationRepository.deleteById(id);
    }
}
