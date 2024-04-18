package com.matei.backend.service;

import com.matei.backend.dto.response.statistics.EventWithTicketsSoldCount;
import com.matei.backend.dto.response.statistics.LocationWithEventsCountResponseDto;
import com.matei.backend.dto.response.statistics.StatisticsResponseDto;
import com.matei.backend.entity.enums.StatisticsFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final UserService userService;
    private final OrderService orderService;
    private final EventService eventService;
    private final LocationService locationService;
    private final TicketService ticketService;


    public StatisticsResponseDto getStatistics(StatisticsFilter filter) {
        CompletableFuture<Long> totalNumberOfUsersFuture = CompletableFuture.supplyAsync(() -> getTotalNumberOfUsers(filter));
        CompletableFuture<Long> totalNumberOfConfirmedOrdersFuture = CompletableFuture.supplyAsync(() -> getTotalNumberOfConfirmedOrders(filter));
        CompletableFuture<Long> totalNumberOfConfirmedTicketsSoldFuture = CompletableFuture.supplyAsync(() -> getTotalNumberOfConfirmedTicketsSold(filter));
        CompletableFuture<Double> totalRevenueFuture = CompletableFuture.supplyAsync(() -> orderService.getTotalRevenue(filter));
        CompletableFuture<Long> totalNumberOfEventsFuture = CompletableFuture.supplyAsync(() -> getTotalNumberOfEvents(filter));
        CompletableFuture<Long> totalNumberOfAvailableEventsFuture = CompletableFuture.supplyAsync(() -> getTotalNumberOfAvailableEvents(filter));
        CompletableFuture<Long> totalNumberOfLocationsFuture = CompletableFuture.supplyAsync(() -> getTotalNumberOfLocations(filter));
        CompletableFuture<List<LocationWithEventsCountResponseDto>> locationsWithAllEventsCountFuture = CompletableFuture.supplyAsync(() -> getLocationsWithAllEventsCount(filter));
        CompletableFuture<List<LocationWithEventsCountResponseDto>> locationsWithAvailableEventsCountFuture = CompletableFuture.supplyAsync(() -> getLocationsWithAvailableEventsCount(filter));
        CompletableFuture<List<EventWithTicketsSoldCount>> eventsWithTicketsSoldCountFuture = CompletableFuture.supplyAsync(() -> getEventsWithTicketsSoldCount(filter));

        CompletableFuture<Void> allFutures = CompletableFuture.allOf(
                totalNumberOfUsersFuture,
                totalNumberOfConfirmedOrdersFuture,
                totalNumberOfConfirmedTicketsSoldFuture,
                totalRevenueFuture,
                totalNumberOfEventsFuture,
                totalNumberOfAvailableEventsFuture,
                totalNumberOfLocationsFuture,
                locationsWithAllEventsCountFuture,
                locationsWithAvailableEventsCountFuture,
                eventsWithTicketsSoldCountFuture
        );

        allFutures.join();

        return StatisticsResponseDto.builder()
                .totalNumberOfUsers(totalNumberOfUsersFuture.join())
                .totalNumberOfConfirmedOrders(totalNumberOfConfirmedOrdersFuture.join())
                .totalRevenue(totalRevenueFuture.join())
                .totalNumberOfConfirmedTicketsSold(totalNumberOfConfirmedTicketsSoldFuture.join())
                .totalNumberOfEvents(totalNumberOfEventsFuture.join())
                .totalNumberOfAvailableEvents(totalNumberOfAvailableEventsFuture.join())
                .totalNumberOfLocations(totalNumberOfLocationsFuture.join())
                .locationsWithAllEventsCount(locationsWithAllEventsCountFuture.join())
                .locationsWithAvailableEventsCount(locationsWithAvailableEventsCountFuture.join())
                .eventsWithTicketsSoldCount(eventsWithTicketsSoldCountFuture.join())
                .build();
    }

    private Long getTotalNumberOfUsers(StatisticsFilter filter) {
        return userService.getTotalNumberOfUsers(filter);
    }
    private Long getTotalNumberOfConfirmedOrders(StatisticsFilter filter) {
        return orderService.getTotalNumberOfConfirmedOrders(filter);
    }
    private Long getTotalNumberOfConfirmedTicketsSold(StatisticsFilter filter) {
        return ticketService.getTotalNumberOfConfirmedTicketsSold(filter);
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
