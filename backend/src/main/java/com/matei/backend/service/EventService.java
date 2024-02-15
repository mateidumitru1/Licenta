package com.matei.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.EventCreationRequestDto;
import com.matei.backend.dto.request.EventUpdateRequestDto;
import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.dto.request.TicketTypeUpdateRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.EventWithTicketTypesResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.entity.TicketType;
import com.matei.backend.exception.EventNotFoundException;
import com.matei.backend.repository.EventRepository;
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

    public EventWithTicketTypesResponseDto createEvent(EventCreationRequestDto eventCreationRequestDto) {
        var event = eventRepository.save(modelMapper.map(eventCreationRequestDto, Event.class));

        var ticketTypes = getTicketTypeCreationRequestDtoList(eventCreationRequestDto.getTicketTypes()).stream()
                .map(ticketTypeCreationRequestDto -> ticketTypeService.createTicketType(ticketTypeCreationRequestDto, Optional.of(event).map(
                        event1 -> modelMapper.map(event1, EventResponseDto.class)).orElseThrow()))
                .toList();
        event.setTicketTypes(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());
        return modelMapper.map(event, EventWithTicketTypesResponseDto.class);
    }

    public EventWithTicketTypesResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return modelMapper.map(event, EventWithTicketTypesResponseDto.class);
    }

    public List<EventResponseDto> getEventListByLocation(UUID locationId) {
        var eventList = eventRepository.findByLocationId(locationId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

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

    public List<EventResponseDto> getAvailableEventListByLocation(UUID locationId) {

       var eventList = eventRepository.findByLocationId(locationId)
                .orElseThrow(() -> new EventNotFoundException("Event not found" )).stream()
               .filter(event -> event.getDate().isAfter(LocalDate.now()))
               .map(event -> EventResponseDto.builder()
                       .id(event.getId())
                       .title(event.getTitle())
                       .date(event.getDate())
                       .shortDescription(event.getShortDescription())
                       .description(event.getDescription())
                       .location(event.getLocation())
                       .imageUrl(event.getImageUrl())
                       .build())
               .toList();;

        return eventList;
    }

    public List<EventWithTicketTypesResponseDto> getAllEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypes().isEmpty()).toList();

        return eventList.stream()
                .map(event -> modelMapper.map(event, EventWithTicketTypesResponseDto.class))
                .toList();
    }

    public List<EventWithTicketTypesResponseDto> getAvailableEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypes().isEmpty()).toList();

        return eventList.stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, EventWithTicketTypesResponseDto.class))
                .toList();
    }

    public EventResponseDto getEventByTitle(String title) {
        var event = eventRepository.findByTitle(title)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return modelMapper.map(event, EventResponseDto.class);
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

        var ticketTypes = getTicketTypeUpdateRequestDtoList(updatedEvent.getTicketTypes());
        ticketTypeService.updateTicketTypes(ticketTypes, Optional.of(event).map(event1 ->
                modelMapper.map(event1, EventResponseDto.class)).orElseThrow());

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
