package com.matei.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.event.EventCreationRequestDto;
import com.matei.backend.dto.request.event.EventUpdateRequestDto;
import com.matei.backend.dto.request.ticketType.TicketTypeCreationRequestDto;
import com.matei.backend.dto.request.ticketType.TicketTypeUpdateRequestDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import com.matei.backend.dto.response.event.*;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.statistics.EventWithTicketsSoldCount;
import com.matei.backend.dto.response.ticketType.TicketTypeWithoutEventResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.entity.TicketType;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.exception.event.EventNotFoundException;
import com.matei.backend.repository.EventRepository;
import com.matei.backend.service.util.ImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final TicketTypeService ticketTypeService;
    private final LocationService locationService;
    private final ArtistService artistService;
    private final ImageService imageService;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    public EventWithTicketTypesResponseDto createEvent(EventCreationRequestDto eventCreationRequestDto) throws IOException {
        var eventToSave = modelMapper.map(eventCreationRequestDto, Event.class);

        eventToSave.setLocation(Optional.of(locationService.getLocationById(UUID.fromString(eventCreationRequestDto.getLocationId())))
                .map(locationResponseDto -> modelMapper.map(locationResponseDto, Location.class))
                .orElseThrow());

        var artistIdList = getArtistIdList(eventCreationRequestDto.getArtistIdList());

        eventToSave.setArtistList(artistService.getArtistsByIds(artistIdList));

        eventToSave.setImageUrl(imageService.saveImage("event-images", eventCreationRequestDto.getImage()));
        eventToSave.setDate(LocalDate.parse(eventCreationRequestDto.getDate().substring(0, 10)));
        eventToSave.setCreatedAt(LocalDateTime.now());

        var event = eventRepository.save(eventToSave);

        var ticketTypes = getTicketTypeCreationRequestDtoList(eventCreationRequestDto.getTicketTypesList()).stream()
                .map(ticketTypeCreationRequestDto ->
                        ticketTypeService.createTicketType(ticketTypeCreationRequestDto, Optional.of(event)
                                .map(event1 -> modelMapper.map(event1, EventWithoutTicketArtistResponseDto.class))
                                .orElseThrow()))
                .toList();

        event.setTicketTypeList(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());
        return modelMapper.map(event, EventWithTicketTypesResponseDto.class);
    }

    public EventWithTicketTypesResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        var eventResponse = modelMapper.map(event, EventWithTicketTypesResponseDto.class);
        eventResponse.setTicketTypeList(event.getTicketTypeList().stream()
                .map(ticketType -> modelMapper.map(ticketType, TicketTypeWithoutEventResponseDto.class))
                .toList());
        eventResponse.setArtistList(event.getArtistList().stream()
                .map(artist -> {
                    var artistResponse = modelMapper.map(artist, ArtistWithoutEventResponseDto.class);
                    artistResponse.setGenreList(artist.getGenreList().stream()
                            .map(genre -> modelMapper.map(genre, GenreWithoutArtistListResponseDto.class))
                            .toList());
                    return artistResponse;
                })
                .toList());

        return eventResponse;
    }

    public List<EventWithoutTicketArtistResponseDto> getEventListByLocation(UUID locationId) {
        var eventList = eventRepository.findByLocationId(locationId)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return eventList.stream()
                .map(event -> EventWithoutTicketArtistResponseDto.builder()
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

    public List<EventWithoutTicketArtistResponseDto> getAvailableEventListByLocation(UUID locationId) {
       var eventList = eventRepository.findByLocationId(locationId)
                .orElseThrow(() -> new EventNotFoundException("Event not found" )).stream()
               .filter(event -> event.getDate().isAfter(LocalDate.now()))
               .map(event -> EventWithoutTicketArtistResponseDto.builder()
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

    public List<EventWithoutTicketArtistResponseDto> getAllEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypeList().isEmpty()).toList();

        return events.stream()
                .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class))
                .toList();
    }

    public List<EventWithoutLocationTicketResponseDto> getAllEventsWithoutLocationTicket() {
        var eventList = eventRepository.findAll();

        return eventList.stream()
                .map(event -> {
                    var eventDto = modelMapper.map(event, EventWithoutLocationTicketResponseDto.class);
                    eventDto.setArtistList(event.getArtistList().stream()
                            .map(artist -> {
                                var artistDto = modelMapper.map(artist, ArtistWithoutEventResponseDto.class);
                                artistDto.setGenreList(artist.getGenreList().stream()
                                        .map(genre -> modelMapper.map(genre, GenreWithoutArtistListResponseDto.class))
                                        .toList());
                                return artistDto;
                            })
                            .toList());
                    return eventDto;
                })
                .toList();
    }

    public List<EventWithTicketTypesResponseDto> getAvailableEvents() {
        var eventList = eventRepository.findAll();

        List<Event> events = eventList.stream().filter(event -> !event.getTicketTypeList().isEmpty()).toList();

        return events.stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, EventWithTicketTypesResponseDto.class))
                .toList();
    }

    public EventWithoutTicketArtistResponseDto getEventByTitle(String title) {
        var event = eventRepository.findByTitle(title)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return modelMapper.map(event, EventWithoutTicketArtistResponseDto.class);
    }

    public EventWithTicketTypesResponseDto updateEvent(EventUpdateRequestDto updatedEvent) throws IOException {
        var event = eventRepository.findById(updatedEvent.getId())
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        String imageUrl = updatedEvent.getImageUrl();
        if(updatedEvent.getImage() != null) {
            if(imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("event-images", updatedEvent.getImage());
        }

        event.setTitle(updatedEvent.getTitle());
        event.setDate(getDateFromString(updatedEvent.getDate()));
        event.setShortDescription(updatedEvent.getShortDescription());
        event.setDescription(updatedEvent.getDescription());
        event.setLocation(Optional.of(locationService.getLocationById(updatedEvent.getLocationId()))
                .map(locationResponseDto -> modelMapper.map(locationResponseDto, Location.class)).orElseThrow());
        event.setArtistList(artistService.getArtistsByIds(getArtistIdList(updatedEvent.getArtistIdList())));
        event.setImageUrl(imageUrl);

        eventRepository.save(event);

        var ticketTypes = getTicketTypeUpdateRequestDtoList(updatedEvent.getTicketTypesList());
        ticketTypeService.updateTicketTypes(ticketTypes, Optional.of(event).map(event1 ->
                modelMapper.map(event1, EventWithoutTicketArtistResponseDto.class)).orElseThrow());

        event.setTicketTypeList(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());

    return modelMapper.map(event, EventWithTicketTypesResponseDto.class);
    }

    public void deleteEventById(UUID id) {
        imageService.deleteImage(eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found")).getImageUrl());
        eventRepository.deleteById(id);
    }

    private List<UUID> getArtistIdList(String artistIds) {
        try {
            return List.of(Objects.requireNonNull(objectMapper.readValue(artistIds, UUID[].class)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
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

    public Long getTotalNumberOfEvents(StatisticsFilter filter) {
        if(filter.equals(StatisticsFilter.ALL)) {
            return eventRepository.count();
        }
        return eventRepository.countByCreatedAtAfter(filter.getStartDate())
                .orElseThrow();
    }

    public Long getTotalNumberOfAvailableEvents(StatisticsFilter filter) {
        if (filter.equals(StatisticsFilter.ALL)) {
            return eventRepository.findAll().stream()
                    .filter(event -> event.getDate().isAfter(LocalDate.now()))
                    .count();
        }
        return eventRepository.findAll().stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .filter(event -> event.getCreatedAt().isAfter(filter.getStartDate()))
                .count();
    }

    public List<EventWithTicketsSoldCount> getEventsWithTicketsSoldCount(StatisticsFilter filter) {
        List<Event> events;
        if (filter.equals(StatisticsFilter.ALL)) {
            events = eventRepository.findAll();
        } else {
            events = eventRepository.findAllByCreatedAtAfter(filter.getStartDate());
        }

        return events.stream()
                .map(event -> {
                    EventWithoutTicketArtistResponseDto eventDto = modelMapper.map(event, EventWithoutTicketArtistResponseDto.class);
                    int ticketsSoldCount = calculateTicketsSoldCount(event);
                    if (ticketsSoldCount == 0)
                        return null;

                    return EventWithTicketsSoldCount.builder()
                            .event(eventDto)
                            .ticketsSoldCount(ticketsSoldCount)
                            .build();
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(EventWithTicketsSoldCount::getTicketsSoldCount).reversed())
                .limit(5)
                .toList();
    }

    private int calculateTicketsSoldCount(Event event) {
        return event.getTicketTypeList().stream()
                .map(ticketType -> ticketType.getTotalQuantity() - ticketType.getRemainingQuantity())
                .reduce(0, Integer::sum);
    }

    public List<SelectedEventResponseDto> selectEvent(String eventIdList) {
        var selectedEvents = new ArrayList<SelectedEventResponseDto>();
        var idList = getEventIdList(eventIdList);
        idList.forEach(id -> {
            var event = eventRepository.findById(id)
                    .orElseThrow(() -> new EventNotFoundException("Event not found"));

            event.setSelected(true);
            eventRepository.save(event);

            selectedEvents.add(modelMapper.map(event, SelectedEventResponseDto.class));
        });

        return selectedEvents;
    }

    public void deselectEvent(UUID id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        event.setSelected(false);
        eventRepository.save(event);
    }

    public List<SelectedEventResponseDto> getSelectedEvents() {
        var selectedEvents = eventRepository.findAllBySelectedTrue();

        return selectedEvents.stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, SelectedEventResponseDto.class))
                .toList();
    }

    public List<SelectedEventResponseDto> getAllEventsForSelection() {
        return eventRepository.findAll().stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, SelectedEventResponseDto.class))
                .toList();
    }

    private List<UUID> getEventIdList(String eventIds) {
        try {
            return List.of(Objects.requireNonNull(objectMapper.readValue(eventIds, UUID[].class)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();
    }

    public Page<EventWithoutAllResponseDto> getMoreRecentEvents(UUID locationId, int page, int size) {
        return eventRepository.findByDateAfterAndLocationIdOrderByDateAsc(LocalDate.now(), locationId, PageRequest.of(page, size))
                .map(event -> modelMapper.map(event, EventWithoutAllResponseDto.class));
    }

    public Page<EventWithoutTicketArtistResponseDto> getInitialEvents(UUID locationId) {
        return eventRepository.findByDateAfterAndLocationIdOrderByDateAsc(LocalDate.now(), locationId, PageRequest.of(0, 10))
                .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class));
    }

    public EventPageWithCountResponseDto getAllEventsPaginatedManage(int page, int size) {
        Page<Event> eventPage = eventRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return EventPageWithCountResponseDto.builder()
                .eventPage(eventPage.map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class)))
                .count(eventPage.getTotalElements())
                .build();
    }

    public EventPageWithCountResponseDto getAllEventsFilteredPaginatedManage(int page, int size, String filter, String search) {
        Page<Event> eventPage = eventRepository.findFilteredEventsPaginated(filter, search, PageRequest.of(page, size));
        return EventPageWithCountResponseDto.builder()
                .eventPage(eventPage.map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class)))
                .count(eventRepository.countFilteredEvents(filter, search))
                .build();
    }
}
