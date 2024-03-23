package com.matei.backend.service;

import com.matei.backend.dto.response.statistics.EventWithTicketsSoldCount;
import com.matei.backend.dto.response.statistics.LocationWithEventsCountResponseDto;
import com.matei.backend.dto.response.statistics.StatisticsResponseDto;
import com.matei.backend.entity.enums.StatisticsFilter;
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

    public StatisticsResponseDto getStatistics(StatisticsFilter filter) {
        return StatisticsResponseDto.builder()
                .totalNumberOfUsers(getTotalNumberOfUsers(filter))
                .totalNumberOfOrders(getTotalNumberOfOrders(filter))
                .totalNumberOfEvents(getTotalNumberOfEvents(filter))
                .totalNumberOfAvailableEvents(getTotalNumberOfAvailableEvents(filter))
                .totalNumberOfLocations(getTotalNumberOfLocations(filter))
                .totalNumberOfTicketsSold(getTotalNumberOfTicketsSold(filter))
                .locationsWithAllEventsCount(getLocationsWithAllEventsCount(filter))
                .locationsWithAvailableEventsCount(getLocationsWithAvailableEventsCount(filter))
                .eventsWithTicketsSoldCount(getEventsWithTicketsSoldCount(filter))
                .build();
    }
    private Long getTotalNumberOfUsers(StatisticsFilter filter) {
        return userService.getTotalNumberOfUsers(filter);
    }
    private Long getTotalNumberOfOrders(StatisticsFilter filter) {
        return orderService.getTotalNumberOfOrders(filter);
    }
    private Long getTotalNumberOfEvents(StatisticsFilter filter) {
        return eventService.getTotalNumberOfEvents(filter);
    }
    private Long getTotalNumberOfAvailableEvents(StatisticsFilter filter) {
        return eventService.getTotalNumberOfAvailableEvents(filter);
    }
    private Long getTotalNumberOfLocations(StatisticsFilter filter) {
        return locationService.getTotalNumberOfLocations(filter);
    }
    private Long getTotalNumberOfTicketsSold(StatisticsFilter filter) {
        return ticketService.getTotalNumberOfTicketsSold(filter);
    }
    private List<LocationWithEventsCountResponseDto> getLocationsWithAllEventsCount(StatisticsFilter filter) {
        return locationService.getLocationsWithAllEventsCount(filter);
    }
    private List<LocationWithEventsCountResponseDto> getLocationsWithAvailableEventsCount(StatisticsFilter filter) {
        return locationService.getLocationsWithAvailableEventsCount(filter);
    }
    private List<EventWithTicketsSoldCount> getEventsWithTicketsSoldCount(StatisticsFilter filter) {
        return eventService.getEventsWithTicketsSoldCount(filter);
    }
}
