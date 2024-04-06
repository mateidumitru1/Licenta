package com.matei.backend.dto.response.event;

import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventWithoutLocationTicketResponseDto {
    private UUID id;
    private String title;
    private LocalDate date;
    private String shortDescription;
    private String description;
    private String imageUrl;
    private List<ArtistWithoutEventResponseDto> artistList;
}
