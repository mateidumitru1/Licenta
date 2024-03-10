package com.matei.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.event.EventCreationRequestDto;
import com.matei.backend.dto.request.event.EventUpdateRequestDto;
import com.matei.backend.dto.request.ticketType.TicketTypeCreationRequestDto;
import com.matei.backend.dto.request.ticketType.TicketTypeUpdateRequestDto;
import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import com.matei.backend.dto.response.event.EventWithTicketTypesResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeWithoutEventResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.entity.TicketType;
import com.matei.backend.exception.EventNotFoundException;
import com.matei.backend.repository.EventRepository;
import com.matei.backend.service.util.ImageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
    private final ModelMapper modelMapper;

    public EventWithTicketTypesResponseDto createEvent(EventCreationRequestDto eventCreationRequestDto) throws IOException {
        var eventToSave = modelMapper.map(eventCreationRequestDto, Event.class);
        eventToSave.setLocation(Optional.of(locationService.getLocationById(UUID.fromString(eventCreationRequestDto.getLocationId())))
                .map(locationResponseDto -> modelMapper.map(locationResponseDto, Location.class)).orElseThrow());
        eventToSave.setImageUrl(imageService.saveImage("event-images", eventCreationRequestDto.getImage()));
        eventToSave.setDate(LocalDate.parse(eventCreationRequestDto.getDate().substring(0, 10)));
        var event = eventRepository.save(eventToSave);

        var ticketTypes = getTicketTypeCreationRequestDtoList(eventCreationRequestDto.getTicketTypesList()).stream()
                .map(ticketTypeCreationRequestDto -> ticketTypeService.createTicketType(ticketTypeCreationRequestDto, Optional.of(event).map(
                        event1 -> modelMapper.map(event1, EventWithoutArtistListResponseDto.class)).orElseThrow()))
                .toList();
        event.setTicketTypes(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());
        return modelMapper.map(event, EventWithTicketTypesResponseDto.class);
    }

    public EventWithTicketTypesResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        var eventResponse = modelMapper.map(event, EventWithTicketTypesResponseDto.class);
        eventResponse.setTicketTypes(event.getTicketTypes().stream()
                .map(ticketType -> modelMapper.map(ticketType, TicketTypeWithoutEventResponseDto.class))
                .toList());

        return eventResponse;
    }

    public List<EventWithoutArtistListResponseDto> getEventListByLocation(UUID locationId) {
        var eventList = eventRepository.findByLocationId(locationId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return eventList.stream()
                .map(event -> EventWithoutArtistListResponseDto.builder()
                        .id(event.getId())
                        .title(event.getTitle())
                        .date(event.getDate())
                        .shortDescription(event.getShortDescription())
                        .description(event.getDescription())
                        .location(modelMapper.map(event.getLocation(), LocationWithoutEventListResponseDto.class))
                        .imageUrl(event.getImageUrl())
                        .build())
                .toList();
    }

    public List<EventWithoutArtistListResponseDto> getAvailableEventListByLocation(UUID locationId) {

       var eventList = eventRepository.findByLocationId(locationId)
                .orElseThrow(() -> new EventNotFoundException("Event not found" )).stream()
               .filter(event -> event.getDate().isAfter(LocalDate.now()))
               .map(event -> EventWithoutArtistListResponseDto.builder()
                       .id(event.getId())
                       .title(event.getTitle())
                       .date(event.getDate())
                       .shortDescription(event.getShortDescription())
                       .description(event.getDescription())
                       .location(modelMapper.map(event.getLocation(), LocationWithoutEventListResponseDto.class))
                       .imageUrl(event.getImageUrl())
                       .build())
               .toList();;

        return eventList;
    }

    public List<EventWithTicketTypesResponseDto> getAllEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypes().isEmpty()).toList();

        return events.stream()
                .map(event -> modelMapper.map(event, EventWithTicketTypesResponseDto.class))
                .toList();
    }

    public List<EventWithTicketTypesResponseDto> getAvailableEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypes().isEmpty()).toList();

        return events.stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, EventWithTicketTypesResponseDto.class))
                .toList();
    }

    public EventWithoutArtistListResponseDto getEventByTitle(String title) {
        var event = eventRepository.findByTitle(title)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return modelMapper.map(event, EventWithoutArtistListResponseDto.class);
    }

    public EventWithTicketTypesResponseDto updateEvent(EventUpdateRequestDto updatedEvent) throws IOException {
        String imageUrl = updatedEvent.getImageUrl();
        if(updatedEvent.getImage() != null) {
            if(imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("event-images", updatedEvent.getImage());
        }

        var event = eventRepository.findById(updatedEvent.getId())
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        event.setTitle(updatedEvent.getTitle());
        event.setDate(getDateFromString(updatedEvent.getDate()));
        event.setShortDescription(updatedEvent.getShortDescription());
        event.setDescription(updatedEvent.getDescription());
        event.setLocation(Optional.of(locationService.getLocationById(updatedEvent.getLocationId()))
                .map(locationResponseDto -> modelMapper.map(locationResponseDto, Location.class)).orElseThrow());
        event.setImageUrl(imageUrl);

        eventRepository.save(event);

        var ticketTypes = getTicketTypeUpdateRequestDtoList(updatedEvent.getTicketTypesList());
        ticketTypeService.updateTicketTypes(ticketTypes, Optional.of(event).map(event1 ->
                modelMapper.map(event1, EventWithoutArtistListResponseDto.class)).orElseThrow());

        event.setTicketTypes(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());

    return modelMapper.map(event, EventWithTicketTypesResponseDto.class);
    }

    public void deleteEventById(UUID id) {
        eventRepository.deleteById(id);
    }

    private LocalDate getDateFromString(String date) {
        return LocalDate.parse(date.substring(0, 10));
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
