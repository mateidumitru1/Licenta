package com.matei.backend.dto.response.event;

import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import com.matei.backend.dto.response.broadGenre.BroadGenreResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeWithoutEventResponseDto;
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
public class EventResponseDto {
    private UUID id;
    private String title;
    private LocalDate date;
    private String shortDescription;
    private String description;
    private LocationWithoutEventListResponseDto location;
    private String imageUrl;
    private BroadGenreResponseDto broadGenre;
    private List<TicketTypeWithoutEventResponseDto> ticketTypeList;
    private List<ArtistWithoutEventResponseDto> artistList;
}
