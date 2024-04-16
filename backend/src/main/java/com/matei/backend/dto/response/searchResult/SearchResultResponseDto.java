package com.matei.backend.dto.response.searchResult;

import com.matei.backend.dto.response.artist.ArtistWithoutEventGenreResponseDto;
import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchResultResponseDto {
    private List<LocationWithoutEventListResponseDto> locationList;
    private List<EventWithoutTicketArtistResponseDto> eventList;
    private List<ArtistWithoutEventGenreResponseDto> artistList;
}
