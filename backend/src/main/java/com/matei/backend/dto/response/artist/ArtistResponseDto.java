package com.matei.backend.dto.response.artist;

import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistResponseDto {
    private UUID id;
    private String name;
    private String imageUrl;
    private List<EventWithoutArtistListResponseDto> eventList;
    private List<GenreWithoutArtistListResponseDto> genreList;
}
