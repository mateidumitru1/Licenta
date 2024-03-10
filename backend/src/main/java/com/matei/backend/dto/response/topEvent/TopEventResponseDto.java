package com.matei.backend.dto.response.topEvent;

import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopEventResponseDto {
    private UUID id;
    private EventWithoutArtistListResponseDto event;
    private String customDescription;
}
