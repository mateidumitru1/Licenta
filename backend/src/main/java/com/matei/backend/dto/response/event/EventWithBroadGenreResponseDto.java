package com.matei.backend.dto.response.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventWithBroadGenreResponseDto {
    private EventWithoutTicketArtistResponseDto event;
    private String broadGenre;
}
