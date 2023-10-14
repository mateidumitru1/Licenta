package com.matei.backend.service;

import com.matei.backend.dto.request.EventRequestDto;
import com.matei.backend.dto.request.PlaceRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Place;
import com.matei.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final PlaceService placeService;

    public EventResponseDto createEvent(EventRequestDto eventRequestDto) {
        var event = eventRepository.save(Event.builder()
                .title(eventRequestDto.getTitle())
                .date(eventRequestDto.getDate())
                .shortDescription(eventRequestDto.getShortDescription())
                .description(eventRequestDto.getDescription())
                .place(placeService.getPlaceById(eventRequestDto.getPlaceId()).map(
                        placeResponseDto -> Place.builder()
                                .id(placeResponseDto.getId())
                                .name(placeResponseDto.getName())
                                .address(placeResponseDto.getAddress())
                                .build())
                        .orElseThrow())
                .build());

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .place(event.getPlace())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public EventResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id).orElseThrow();

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .place(event.getPlace())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public List<EventResponseDto> getEventListByPlace(String placeName) {
        var eventList = eventRepository
                .findByPlaceName(placeName)
                .orElseThrow();

        return eventList.stream()
                .map(event -> EventResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .date(event.getDate())
                        .shortDescription(event.getShortDescription())
                        .description(event.getDescription())
                        .place(event.getPlace())
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
                        .place(event.getPlace())
                        .imageUrl(event.getImageUrl())
                        .build())
                .toList();
    }

    public EventResponseDto getEventListByTitle(String title) {
        var event = eventRepository
                .findByTitle(title)
                .orElseThrow();

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .place(event.getPlace())
                .imageUrl(event.getImageUrl())
                .build();
    }

    public EventResponseDto updateEvent(EventRequestDto updatedEvent) {
        var event = eventRepository.save(Event.builder()
                .id(updatedEvent.getId())
                .title(updatedEvent.getTitle())
                .date(updatedEvent.getDate())
                .shortDescription(updatedEvent.getShortDescription())
                .description(updatedEvent.getDescription())
                .place(placeService.getPlaceById(updatedEvent.getPlaceId()).map(
                        placeResponseDto -> Place.builder()
                                .id(placeResponseDto.getId())
                                .name(placeResponseDto.getName())
                                .address(placeResponseDto.getAddress())
                                .build())
                        .orElseThrow())
                .build());

        return EventResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .place(event.getPlace())
                .build();
    }

    public void deleteEventById(UUID id) {
        eventRepository.deleteById(id);
    }

}
