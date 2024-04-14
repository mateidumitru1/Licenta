package com.matei.backend.dto.response.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HomeEventsResponseDto {
    List<RecommendedEventResponseDto> recommendedEvents;
    List<SelectedEventResponseDto> selectedEvents;
}
