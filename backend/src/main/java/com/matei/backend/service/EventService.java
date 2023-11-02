package com.matei.backend.service;

import com.matei.backend.dto.request.EventRequestDto;
import com.matei.backend.dto.request.EventUpdateRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.exception.EventNotFoundException;
import com.matei.backend.exception.LocationNotFoundException;
import com.matei.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final LocationService locationService;
    private final ImageService imageService;

    public EventResponseDto createEvent(EventRequestDto eventRequestDto) {
        var event = eventRepository.save(Event.builder()
                .title(eventRequestDto.getTitle())
                .date(eventRequestDto.getDate())
                .shortDescription(eventRequestDto.getShortDescription())
                .description(eventRequestDto.getDescription())
                .location(Optional.of(locationService.getLocationById(eventRequestDto.getLocationId())).map(
                        locationResponseDto -> Location.builder()
                                .id(locationResponseDto.getId())
                                .name(locationResponseDto.getName())
                                .address(locationResponseDto.getAddress())
                                .build())
                        .orElseThrow())
                .build());

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public EventResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id).orElseThrow(
                () -> new EventNotFoundException("Event not found")
        );

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public List<EventResponseDto> getEventListByLocation(String locationName) {
        var eventList = eventRepository
                .findByLocationName(locationName)
                .orElseThrow();

        return eventList.stream()
                .map(event -> EventResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .date(event.getDate())
                        .shortDescription(event.getShortDescription())
                        .description(event.getDescription())
                        .location(event.getLocation())
                        .imageUrl(event.getImageUrl())
                        .build())
                .toList();
    }

    public List<EventResponseDto> getAllEvents() {
        var eventList = eventRepository.findAll();

        return eventList.stream()
                .map(event -> EventResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .date(event.getDate())
                        .shortDescription(event.getShortDescription())
                        .description(event.getDescription())
                        .location(event.getLocation())
                        .imageUrl(event.getImageUrl())
                        .build())
                .toList();
    }

    public EventResponseDto getEventByTitle(String title) {
        var event = eventRepository
                .findByTitle(title)
                .orElseThrow(
                        () -> new EventNotFoundException("Event not found")
                );

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public EventResponseDto updateEvent(EventUpdateRequestDto updatedEvent) throws IOException {
        String imageUrl = updatedEvent.getImageUrl();
        if(updatedEvent.getImage() != null) {
            if(imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("event-images", updatedEvent.getImage());
        }

        var event = eventRepository.findById(updatedEvent.getId()).orElseThrow(
                () -> new EventNotFoundException("Event not found")
        );

        if(!Objects.equals(updatedEvent.getTitle(), event.getTitle())) {
            event.setTitle(updatedEvent.getTitle());
        }

        var date = LocalDate.parse(updatedEvent.getDate().substring(0, 10));
        if(!Objects.equals(date, event.getDate())) {
            event.setDate(date);
        }
        if(!Objects.equals(updatedEvent.getShortDescription(), event.getShortDescription())) {
            event.setShortDescription(updatedEvent.getShortDescription());
        }
        if(!Objects.equals(updatedEvent.getDescription(), event.getDescription())) {
            event.setDescription(updatedEvent.getDescription());
        }
        if(!Objects.equals(updatedEvent.getLocationId(), event.getLocation().getId())) {
            event.setLocation(Optional.of(locationService.getLocationById(updatedEvent.getLocationId())).map(
                    locationResponseDto -> Location.builder()
                            .id(locationResponseDto.getId())
                            .name(locationResponseDto.getName())
                            .address(locationResponseDto.getAddress())
                            .build())
                    .orElseThrow(
                            () -> new LocationNotFoundException("Location not found")
                    ));
        }
        if(!Objects.equals(imageUrl, event.getImageUrl())) {
            event.setImageUrl(imageUrl);
        }

        eventRepository.save(event);

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public void deleteEventById(UUID id) {
        eventRepository.deleteById(id);
    }

}
