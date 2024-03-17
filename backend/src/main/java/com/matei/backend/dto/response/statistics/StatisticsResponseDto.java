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
    private Long totalNumberOfOrders;
    private Long totalNumberOfEvents;
    private Long totalNumberOfAvailableEvents;
    private Long totalNumberOfLocations;
    private Long totalNumberOfTicketsSold;
    private List<LocationWithEventsCountResponseDto> locationsWithAllEventsCount;
    private List<LocationWithEventsCountResponseDto> locationsWithAvailableEventsCount;
}
