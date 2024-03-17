package com.matei.backend.service;

import com.matei.backend.dto.response.statistics.LocationWithEventsCountResponseDto;
import com.matei.backend.dto.response.statistics.StatisticsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final UserService userService;
    private final OrderService orderService;
    private final EventService eventService;
    private final LocationService locationService;
    private final TicketService ticketService;

    public StatisticsResponseDto getStatistics() {
        return StatisticsResponseDto.builder()
                .totalNumberOfUsers(getTotalNumberOfUsers())
                .totalNumberOfOrders(getTotalNumberOfOrders())
                .totalNumberOfEvents(getTotalNumberOfEvents())
                .totalNumberOfAvailableEvents(getTotalNumberOfAvailableEvents())
                .totalNumberOfLocations(getTotalNumberOfLocations())
                .totalNumberOfTicketsSold(getTotalNumberOfTicketsSold())
                .locationsWithAllEventsCount(getLocationsWithAllEventsCount())
                .locationsWithAvailableEventsCount(getLocationsWithAvailableEventsCount())
                .build();
    }

    private Long getTotalNumberOfUsers() {
        return userService.getTotalNumberOfUsers();
    }

    private Long getTotalNumberOfOrders() {
        return orderService.getTotalNumberOfOrders();
    }

    private Long getTotalNumberOfEvents() {
        return eventService.getTotalNumberOfEvents();
    }

    private Long getTotalNumberOfAvailableEvents() {
        return eventService.getTotalNumberOfAvailableEvents();
    }

    private Long getTotalNumberOfLocations() {
        return locationService.getTotalNumberOfLocations();
    }

    private Long getTotalNumberOfTicketsSold() {
        return ticketService.getTotalNumberOfTicketsSold();
    }

    private List<LocationWithEventsCountResponseDto> getLocationsWithAllEventsCount() {
        return locationService.getLocationsWithAllEventsCount();
    }

    private List<LocationWithEventsCountResponseDto> getLocationsWithAvailableEventsCount() {
        return locationService.getLocationsWithAvailableEventsCount();
    }
}
