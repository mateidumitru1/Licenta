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
import com.matei.backend.dto.response.location.LocationWithEventPageResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.preference.UserGenrePreferenceResponseDto;
import com.matei.backend.dto.response.statistics.EventWithTicketsSoldCount;
import com.matei.backend.dto.response.ticketType.TicketTypeWithoutEventResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.entity.TicketType;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.exception.event.EventNotFoundException;
import com.matei.backend.repository.BroadGenreRepository;
import com.matei.backend.repository.EventRepository;
import com.matei.backend.repository.LocationRepository;
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
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final BroadGenreRepository broadGenreRepository;
    private final TicketTypeService ticketTypeService;
    private final LocationService locationService;
    private final ArtistService artistService;
    private final UserGenrePreferenceService userGenrePreferenceService;
    private final ImageService imageService;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final LocationRepository locationRepository;

    public EventPageWithCountResponseDto createEvent(EventCreationRequestDto eventCreationRequestDto, int page, int size) throws IOException {
        var eventToSave = modelMapper.map(eventCreationRequestDto, Event.class);

        eventToSave.setLocation(Optional.of(locationService.getLocationById(UUID.fromString(eventCreationRequestDto.getLocationId())))
                .map(locationResponseDto -> modelMapper.map(locationResponseDto, Location.class))
                .orElseThrow());

        var artistIdList = getArtistIdList(eventCreationRequestDto.getArtistIdList());

        eventToSave.setArtistList(artistService.getArtistsByIdList(artistIdList));

        eventToSave.setImageUrl(imageService.saveImage("event-images", eventCreationRequestDto.getImage()));
        eventToSave.setDate(LocalDate.parse(eventCreationRequestDto.getDate().substring(0, 10)));
        eventToSave.setCreatedAt(LocalDateTime.now());
        eventToSave.setBroadGenre(broadGenreRepository.findById(UUID.fromString(eventCreationRequestDto.getBroadGenreId()))
                .orElseThrow());

        var event = eventRepository.save(eventToSave);

        var ticketTypes = getTicketTypeCreationRequestDtoList(eventCreationRequestDto.getTicketTypesList()).stream()
                .map(ticketTypeCreationRequestDto ->
                        ticketTypeService.createTicketType(ticketTypeCreationRequestDto, Optional.of(event)
                                .map(event1 -> modelMapper.map(event1, EventWithoutTicketArtistResponseDto.class))
                                .orElseThrow()))
                .toList();

        event.setTicketTypeList(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());

        return getAllEventsPaginatedManage(page, size);
    }

    public EventResponseDto getEventById(UUID id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        var eventResponse = modelMapper.map(event, EventResponseDto.class);
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

    public EventResponseDto updateEvent(EventUpdateRequestDto updatedEvent) throws IOException {
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
        event.setArtistList(artistService.getArtistsByIdList(getArtistIdList(updatedEvent.getArtistIdList())));
        event.setImageUrl(imageUrl);
        event.setBroadGenre(broadGenreRepository.findById(UUID.fromString(updatedEvent.getBroadGenreId()))
                .orElseThrow());

        eventRepository.save(event);

        var ticketTypes = getTicketTypeUpdateRequestDtoList(updatedEvent.getTicketTypesList());
        ticketTypeService.updateTicketTypes(ticketTypes, Optional.of(event).map(event1 ->
                modelMapper.map(event1, EventWithoutTicketArtistResponseDto.class)).orElseThrow());

        event.setTicketTypeList(ticketTypes.stream().map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class))
                .toList());

    return modelMapper.map(event, EventResponseDto.class);
    }

    public EventPageWithCountResponseDto deleteEventById(UUID id, int page, int size) {
        imageService.deleteImage(eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found")).getImageUrl());
        eventRepository.deleteById(id);
        return getAllEventsPaginatedManage(page, size);
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
            events = eventRepository.findAllByCreatedAtAfter(filter.getStartDate())
                    .orElseThrow(() -> new EventNotFoundException("Event not found"));
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
        var selectedEvents = eventRepository.findAllBySelectedTrueAndDateAfter(LocalDate.now())
                .orElseThrow(() -> new EventNotFoundException("Event not found"));

        return selectedEvents.stream()
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, SelectedEventResponseDto.class))
                .toList();
    }

    public List<SelectedEventResponseDto> getAllEventsForSelection() {
        return eventRepository.findAllByDateAfter(LocalDate.now())
                .orElseThrow(() -> new EventNotFoundException("Event not found")).stream()
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

    public Page<EventWithoutAllResponseDto> getLocationWithMoreEvents(UUID locationId, int page, int size) {
        return eventRepository.findByDateAfterAndLocationIdOrderByDateAsc(LocalDate.now(), locationId, PageRequest.of(page, size))
                .map(event -> modelMapper.map(event, EventWithoutAllResponseDto.class));
    }

    public LocationWithEventPageResponseDto getLocationWithInitialEvents(UUID locationId) {
        var eventPage = eventRepository.findByDateAfterAndLocationIdOrderByDateAsc(LocalDate.now(), locationId, PageRequest.of(0, 10))
                .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class));
        var location = locationRepository.findById(locationId).map(l -> modelMapper.map(l, LocationWithEventPageResponseDto.class))
                .orElseThrow(() -> new EventNotFoundException("Location not found"));
        location.setEventPage(eventPage);
        return location;
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

    public List<RecommendedEventResponseDto> getRecommendedEvents(String currentUserId) {
        if (currentUserId == null || currentUserId.isEmpty()) {
            return Collections.emptyList();
        }
        List<UserGenrePreferenceResponseDto> userGenrePreferences = userGenrePreferenceService.getUserGenrePreferences(UUID.fromString(currentUserId));

        Set<RecommendedEventResponseDto> recommendedEvents = new HashSet<>();
        var availableEvents = eventRepository.findAllByBroadGenreInAndDateAfter(userGenrePreferences.stream()
                        .map(UserGenrePreferenceResponseDto::getBroadGenre)
                        .toList(), LocalDate.now()).orElseThrow().stream()
                .map(event -> modelMapper.map(event, RecommendedEventResponseDto.class))
                .toList();

        userGenrePreferences.forEach(userGenrePreference -> {
            int numberOfEventsToRecommend = (int) Math.round(userGenrePreference.getPercentage() / 100 * 10);

            List<RecommendedEventResponseDto> recommendedEventsToReturn = new ArrayList<>(availableEvents.stream()
                    .filter(event -> event.getBroadGenre().getName().equals(userGenrePreference.getBroadGenre()))
                    .toList());

            Collections.shuffle(recommendedEventsToReturn);

            recommendedEvents.addAll(recommendedEventsToReturn.stream()
                    .limit(numberOfEventsToRecommend)
                    .toList());
        });

        return recommendedEvents.stream()
                .sorted(Comparator.comparing(RecommendedEventResponseDto::getDate))
                .toList();
    }

    public HomeEventsResponseDto getHomeEvents(String currentUserId) {
        CompletableFuture<List<SelectedEventResponseDto>> selectedEventsFuture = CompletableFuture.supplyAsync(() -> getSelectedEvents());
        CompletableFuture<List<RecommendedEventResponseDto>> recommendedEventsFuture = CompletableFuture.supplyAsync(() -> getRecommendedEvents(currentUserId));

        return CompletableFuture.allOf(selectedEventsFuture, recommendedEventsFuture)
                .thenApply(ignoredVoid -> {
                    List<SelectedEventResponseDto> selectedEvents = selectedEventsFuture.join();
                    List<RecommendedEventResponseDto> recommendedEvents = recommendedEventsFuture.join();

                    return HomeEventsResponseDto.builder()
                            .selectedEvents(selectedEvents)
                            .recommendedEvents(recommendedEvents)
                            .build();
                })
                .join();
    }

    public List<EventWithoutTicketArtistResponseDto> getEventsForUser(UUID id) {
        var user = userService.getUserById(id);

        return user.getOrderList().stream()
                .map(order -> order.getTicketList().stream()
                        .map(ticket -> ticket.getTicketType().getEvent())
                        .toList())
                .flatMap(Collection::stream)
                .filter(event -> event.getDate().isAfter(LocalDate.now()))
                .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class))
                .toList();
    }

    public List<EventWithoutTicketArtistResponseDto> searchEvents(String query) {
        return eventRepository.findByTitleContainingIgnoreCase(query, PageRequest.of(0, 3)).stream()
                .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class))
                .toList();
    }
}
