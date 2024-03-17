package com.matei.backend.dto.response.statistics;

import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationWithEventsCountResponseDto {
    private LocationWithoutEventListResponseDto location;
    private Long eventsCount;
}
