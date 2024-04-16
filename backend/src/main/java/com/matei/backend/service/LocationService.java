package com.matei.backend.service;

import com.matei.backend.dto.request.location.LocationCreationRequestDto;
import com.matei.backend.dto.request.location.LocationUpdateRequestDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import com.matei.backend.dto.response.event.EventWithoutLocationTicketResponseDto;
import com.matei.backend.dto.response.location.LocationPageWithCountResponseDto;
import com.matei.backend.dto.response.location.LocationResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.statistics.LocationWithEventsCountResponseDto;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.exception.location.LocationAlreadyExistsException;
import com.matei.backend.exception.location.LocationNotFoundException;
import com.matei.backend.repository.LocationRepository;
import com.matei.backend.entity.Location;
import com.matei.backend.service.util.ImageService;
import com.matei.backend.service.util.MapBoxService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;
    private final ImageService imageService;
    private final ModelMapper modelMapper;
    private final MapBoxService mapBoxService;
    private final UserService userService;

    public LocationPageWithCountResponseDto createLocation(LocationCreationRequestDto locationCreationRequestDto, int page, int size) throws IOException {
        if(locationRepository.findByName(locationCreationRequestDto.getName()).isPresent()) {
            throw new LocationAlreadyExistsException("Location already exists");
        }

        var mapBoxGeocodingResponse = mapBoxService.getCoordinates(locationCreationRequestDto.getName());

        var locationToSave = modelMapper.map(locationCreationRequestDto, Location.class);
        locationToSave.setImageUrl(imageService.saveImage("location-images", locationCreationRequestDto.getImage()));
        locationToSave.setLatitude(mapBoxGeocodingResponse.getFeatures().getFirst().getCenter().get(1));
        locationToSave.setLongitude(mapBoxGeocodingResponse.getFeatures().getFirst().getCenter().get(0));
        locationToSave.setCreatedAt(LocalDateTime.now());

        var location = locationRepository.save(locationToSave);

        return getLocationsPaginatedManage(page, size);
    }

    public List<LocationWithoutEventListResponseDto> getAllLocations() {
        var locations = locationRepository.findAll();

        return locations.stream()
                .map(location -> modelMapper.map(location, LocationWithoutEventListResponseDto.class))
                .toList();
    }

    public LocationResponseDto getLocationById(UUID id) {
        var location = locationRepository.findById(id).orElseThrow(() -> new LocationNotFoundException("Location not found"));

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

    public LocationPageWithCountResponseDto deleteLocationById(UUID id, int page, int size) {
        imageService.deleteImage(locationRepository.findById(id)
                .orElseThrow(() -> new LocationNotFoundException("Location not found"))
                .getImageUrl());
        locationRepository.deleteById(id);
        return getLocationsPaginatedManage(page, size);
    }

    public Long getTotalNumberOfLocations(StatisticsFilter filter) {
        if(filter == StatisticsFilter.ALL) {
            return locationRepository.count();
        }
        return locationRepository.countByCreatedAtAfter(filter.getStartDate());
    }

    public List<LocationWithEventsCountResponseDto> getLocationsWithAllEventsCount(StatisticsFilter filter) {
        List<Location> locations;
        if (filter == StatisticsFilter.ALL) {
            locations = locationRepository.findAll();
        }
        else {
            locations = locationRepository.findAllWithEventsCreatedAfter(filter.getStartDate());
        }

        return locations.stream()
                .map(location -> LocationWithEventsCountResponseDto.builder()
                        .location(modelMapper.map(location, LocationWithoutEventListResponseDto.class))
                        .eventsCount((long) location.getEventList().size())
                        .build())
                .sorted((location1, location2) -> Long.compare(location2.getEventsCount(), location1.getEventsCount()))
                .toList();
    }

    public List<LocationWithEventsCountResponseDto> getLocationsWithAvailableEventsCount(StatisticsFilter filter) {
        List<Location> locations;
        if (filter == StatisticsFilter.ALL) {
            locations = locationRepository.findAll();
        }
        else {
            locations = locationRepository.findAllWithEventsCreatedAfter(filter.getStartDate());
        }

        return locations.stream()
                .map(location -> LocationWithEventsCountResponseDto.builder()
                        .location(modelMapper.map(location, LocationWithoutEventListResponseDto.class))
                        .eventsCount((long) location.getEventList().stream()
                                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                                .toList()
                                .size())
                        .build())
                .sorted((location1, location2) -> Long.compare(location2.getEventsCount(), location1.getEventsCount()))
                .toList();
    }

    public LocationPageWithCountResponseDto getLocationsPaginatedManage(int page, int size) {
        Page<Location> locationPage = locationRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));

        return LocationPageWithCountResponseDto.builder()
                .locationPage(locationPage.map(location -> modelMapper.map(location, LocationWithoutEventListResponseDto.class)))
                .count(locationRepository.count())
                .build();

    }

    public LocationPageWithCountResponseDto getLocationsFilteredPaginatedManage(int page, int size, String filter, String search) {
        Page<Location> locationPage = locationRepository.findFilteredLocationsPaginated(filter, search, PageRequest.of(page, size));
        return LocationPageWithCountResponseDto.builder()
                .locationPage(locationPage.map(location -> modelMapper.map(location, LocationWithoutEventListResponseDto.class)))
                .count(locationRepository.countFilteredLocations(filter, search))
                .build();
    }

    public List<LocationResponseDto> getAllLocationsWithAvailableEvents() {
        return locationRepository.findLocationsByEventListDateAfter(LocalDate.now()).orElseThrow(() -> new LocationNotFoundException("Location not found"))
                .stream()
                .map(location -> {
                    var locationDto = modelMapper.map(location, LocationResponseDto.class);
                    locationDto.setEventList(location.getEventList().stream()
                            .filter(event -> event.getDate().isAfter(LocalDate.now()))
                            .map(event -> {
                                var eventDto = modelMapper.map(event, EventWithoutLocationTicketResponseDto.class);
                                eventDto.setArtistList(event.getArtistList().stream()
                                        .map(artist -> modelMapper.map(artist, ArtistWithoutEventResponseDto.class))
                                        .toList());
                                return eventDto;
                            })
                            .toList());
                    return locationDto;
                })
                .toList();
    }

    public List<LocationWithoutEventListResponseDto> searchLocations(String query) {
        return locationRepository.findByNameContainingIgnoreCase(query, PageRequest.of(0, 3)).stream()
                .map(location -> modelMapper.map(location, LocationWithoutEventListResponseDto.class))
                .toList();
    }
}
