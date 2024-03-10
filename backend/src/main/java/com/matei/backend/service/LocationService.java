package com.matei.backend.service;

import com.matei.backend.dto.request.location.LocationCreationRequestDto;
import com.matei.backend.dto.request.location.LocationUpdateRequestDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import com.matei.backend.dto.response.event.EventWithoutLocationResponseDto;
import com.matei.backend.dto.response.location.LocationResponseDto;
import com.matei.backend.exception.AdminResourceAccessException;
import com.matei.backend.exception.LocationAlreadyExistsException;
import com.matei.backend.exception.LocationNotFoundException;
import com.matei.backend.repository.LocationRepository;
import com.matei.backend.entity.Location;
import com.matei.backend.service.util.ImageService;
import com.matei.backend.service.util.MapBoxService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final ImageService imageService;
    private final ModelMapper modelMapper;
    private final MapBoxService mapBoxService;
    private final UserService userService;

    public LocationResponseDto createLocation(LocationCreationRequestDto locationCreationRequestDto, UUID userId) throws IOException {
        if(!userService.isAdmin(userId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }

        if(locationRepository.findByName(locationCreationRequestDto.getName()).isPresent()) {
            throw new LocationAlreadyExistsException("Location already exists");
        }

        var mapBoxGeocodingResponse = mapBoxService.getCoordinates(locationCreationRequestDto.getName());

        var locationToSave = modelMapper.map(locationCreationRequestDto, Location.class);
        locationToSave.setImageUrl(imageService.saveImage("location-images", locationCreationRequestDto.getImage()));
        locationToSave.setLatitude(mapBoxGeocodingResponse.getFeatures().getFirst().getCenter().get(1));
        locationToSave.setLongitude(mapBoxGeocodingResponse.getFeatures().getFirst().getCenter().get(0));

        var location = locationRepository.save(locationToSave);

        return modelMapper.map(location, LocationResponseDto.class);
    }

    public List<LocationResponseDto> getAllLocations() {
        var locations = locationRepository.findAll();

        return locations.stream()
                .map(location -> modelMapper.map(location, LocationResponseDto.class))
                .toList();
    }

    public LocationResponseDto getLocationById(UUID id) {
        var location = locationRepository.findById(id).orElseThrow(() -> new LocationNotFoundException("Location not found"));

        return modelMapper.map(location, LocationResponseDto.class);
    }

    public List<LocationResponseDto> getAllLocationsWithAvailableEvents() {
        var locations = locationRepository.findAll();

        return locations.stream()
                .map(this::getLocationWithAvailableEventsResponseDto)
                .toList();
    }

    private LocationResponseDto getLocationWithAvailableEventsResponseDto(Location location) {
        var availableEvents = location.getEventList().stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> {
                    var artistList = event.getArtists().stream()
                            .map(artist -> modelMapper.map(artist, ArtistWithoutEventResponseDto.class))
                            .toList();
                    var eventDto = modelMapper.map(event, EventWithoutLocationResponseDto.class);
                    eventDto.setArtistList(artistList);
                    return eventDto;
                })
                .toList();

        var locationResponseDto = modelMapper.map(location, LocationResponseDto.class);
        locationResponseDto.setEventList(availableEvents);

        return locationResponseDto;
    }

    public LocationResponseDto getLocationWithAvailableEventsById(UUID id) {
        var location = locationRepository.findById(id).orElseThrow(() -> new LocationNotFoundException("Location not found"));

        return getLocationWithAvailableEventsResponseDto(location);
    }

    public LocationResponseDto getLocationWithUnavailableEventsById(UUID id) {
        var location = locationRepository.findById(id).orElseThrow(() -> new LocationNotFoundException("Location not found"));

        var unavailableEvents = location.getEventList().stream()
                .filter(event -> event.getDate().isBefore(LocalDate.now()))
                .map(event -> {
                    var artistList = event.getArtists().stream()
                            .map(artist -> modelMapper.map(artist, ArtistWithoutEventResponseDto.class))
                            .toList();
                    var eventDto = modelMapper.map(event, EventWithoutLocationResponseDto.class);
                    eventDto.setArtistList(artistList);
                    return eventDto;
                })
                .toList();

        var locationResponseDto = modelMapper.map(location, LocationResponseDto.class);
        locationResponseDto.setEventList(unavailableEvents);

        return locationResponseDto;    }

    public LocationResponseDto updateLocation(LocationUpdateRequestDto updatedLocation, UUID userId) throws IOException {
        if(!userService.isAdmin(userId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }
        String imageUrl = updatedLocation.getImageUrl();
        if(updatedLocation.getImage() != null) {
            if(imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("location-images", updatedLocation.getImage());
        }

        var location = locationRepository.findById(updatedLocation.getId())
                .orElseThrow(() -> new LocationNotFoundException("Location not found"));

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
