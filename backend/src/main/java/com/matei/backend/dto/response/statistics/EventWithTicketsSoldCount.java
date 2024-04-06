package com.matei.backend.dto.response.statistics;

import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventWithTicketsSoldCount {
    private EventWithoutTicketArtistResponseDto event;
    private Integer ticketsSoldCount;
}
