package com.matei.backend.dto.response.statistics;

import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventWithTicketsSoldCount {
    private EventWithoutArtistListResponseDto event;
    private Integer ticketsSoldCount;
}
