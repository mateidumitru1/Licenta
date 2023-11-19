package com.matei.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.EventCreationRequestDto;
import com.matei.backend.dto.request.EventUpdateRequestDto;
import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.dto.request.TicketTypeUpdateRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.EventWithTicketTypesResponseDto;
import com.matei.backend.dto.response.TicketTypeResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.entity.TicketType;
import com.matei.backend.exception.EventNotFoundException;
import com.matei.backend.exception.LocationNotFoundException;
import com.matei.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final TicketTypeService ticketTypeService;
    private final LocationService locationService;
    private final ImageService imageService;
    private final ObjectMapper objectMapper;

    public EventWithTicketTypesResponseDto createEvent(EventCreationRequestDto eventCreationRequestDto) throws IOException {
        var event = eventRepository.save(Event.builder()
                .title(eventCreationRequestDto.getTitle())
                .date(getDateFromString(eventCreationRequestDto.getDate()))
                .shortDescription(eventCreationRequestDto.getShortDescription())
                .description(eventCreationRequestDto.getDescription())
                .imageUrl(imageService.saveImage("event-images", eventCreationRequestDto.getImage()))
                .location(Optional.of(locationService.getLocationById(UUID.fromString(eventCreationRequestDto.getLocationId()))).map(
                        locationResponseDto -> Location.builder()
                                .id(locationResponseDto.getId())
                                .name(locationResponseDto.getName())
                                .address(locationResponseDto.getAddress())
                                .build())
                        .orElseThrow())
                .build());

        var ticketTypes = getTicketTypeCreationRequestDtoList(eventCreationRequestDto.getTicketTypes()).stream()
                .map(ticketTypeCreationRequestDto -> ticketTypeService.createTicketType(ticketTypeCreationRequestDto, Optional.of(event).map(
                        event1 -> EventResponseDto.builder()
                                .id(event1.getId())
                                .title(event1.getTitle())
                                .date(event1.getDate())
                                .shortDescription(event1.getShortDescription())
                                .description(event1.getDescription())
                                .location(event1.getLocation())
                                .imageUrl(event1.getImageUrl())
                                .build())
                        .orElseThrow()))
                .toList();
        event.setTicketTypes(ticketTypes.stream().map(ticketTypeResponseDto -> TicketType.builder()
                .id(ticketTypeResponseDto.getId())
                .name(ticketTypeResponseDto.getName())
                .price(ticketTypeResponseDto.getPrice())
                .quantity(ticketTypeResponseDto.getQuantity())
                .build()).toList());
        return getEventWithTicketTypesResponseDto(event);
    }

    public EventWithTicketTypesResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id).orElseThrow(
                () -> new EventNotFoundException("Event not found")
        );

        return getEventWithTicketTypesResponseDto(event);
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

    public List<EventWithTicketTypesResponseDto> getAllEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypes().isEmpty()).toList();

        return eventList.stream()
                .map(event -> EventWithTicketTypesResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .date(event.getDate())
                        .shortDescription(event.getShortDescription())
                        .description(event.getDescription())
                        .location(event.getLocation())
                        .imageUrl(event.getImageUrl())
                        .ticketTypes(event.getTicketTypes().stream()
                                .map(ticketType -> TicketTypeResponseDto.builder()
                                        .id(ticketType.getId())
                                        .name(ticketType.getName())
                                        .price(ticketType.getPrice())
                                        .quantity(ticketType.getQuantity())
                                        .build()).toList())
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

    public EventWithTicketTypesResponseDto updateEvent(EventUpdateRequestDto updatedEvent) throws IOException {
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

        event.setTitle(updatedEvent.getTitle());
        event.setDate(getDateFromString(updatedEvent.getDate()));
        event.setShortDescription(updatedEvent.getShortDescription());
        event.setDescription(updatedEvent.getDescription());
        event.setLocation(Optional.of(locationService.getLocationById(updatedEvent.getLocationId())).map(
                locationResponseDto -> Location.builder()
                        .id(locationResponseDto.getId())
                        .name(locationResponseDto.getName())
                        .address(locationResponseDto.getAddress())
                        .build())
                .orElseThrow());
        event.setImageUrl(imageUrl);
        event.setTicketTypes(getTicketTypeUpdateRequestDtoList(updatedEvent.getTicketTypes()).stream()
                .map(ticketTypeUpdateRequestDto -> TicketType.builder()
                        .id(UUID.fromString(ticketTypeUpdateRequestDto.getId()))
                        .name(ticketTypeUpdateRequestDto.getName())
                        .price(Double.valueOf(ticketTypeUpdateRequestDto.getPrice()))
                        .quantity(Integer.valueOf(ticketTypeUpdateRequestDto.getQuantity()))
                        .build()).toList());


        eventRepository.save(event);

        return getEventWithTicketTypesResponseDto(event);
    }

    public void deleteEventById(UUID id) {
        eventRepository.deleteById(id);
    }

    private LocalDate getDateFromString(String date) {
        return LocalDate.parse(date.substring(0, 10));
    }

    private EventWithTicketTypesResponseDto getEventWithTicketTypesResponseDto(Event event) {
        return EventWithTicketTypesResponseDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .shortDescription(event.getShortDescription())
                .description(event.getDescription())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .ticketTypes(event.getTicketTypes().stream()
                        .map(ticketType -> TicketTypeResponseDto.builder()
                                .id(ticketType.getId())
                                .name(ticketType.getName())
                                .price(ticketType.getPrice())
                                .quantity(ticketType.getQuantity())
                                .build()).toList())
                .build();
    }

    private List<TicketTypeCreationRequestDto> getTicketTypeCreationRequestDtoList(String ticketTypes) {
        try {
            return List.of(Objects.requireNonNull(objectMapper.readValue(ticketTypes, TicketTypeCreationRequestDto[].class)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }

    private List<TicketTypeUpdateRequestDto> getTicketTypeUpdateRequestDtoList(String ticketTypes) {
        try {
            return List.of(Objects.requireNonNull(objectMapper.readValue(ticketTypes, TicketTypeUpdateRequestDto[].class)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }
}
