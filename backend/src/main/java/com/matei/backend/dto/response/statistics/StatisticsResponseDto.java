package com.matei.backend.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsResponseDto {
    private Long totalNumberOfUsers;
    private Long totalNumberOfConfirmedOrders;
    private Long totalNumberOfConfirmedTicketsSold;
    private Double totalRevenue;
    private Long totalNumberOfEvents;
    private Long totalNumberOfAvailableEvents;
    private Long totalNumberOfLocations;
    private List<LocationWithEventsCountResponseDto> locationsWithAllEventsCount;
    private List<LocationWithEventsCountResponseDto> locationsWithAvailableEventsCount;
    private List<EventWithTicketsSoldCount> eventsWithTicketsSoldCount;
}
