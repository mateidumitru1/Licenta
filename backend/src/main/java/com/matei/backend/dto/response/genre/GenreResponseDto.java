package com.matei.backend.dto.response.genre;

import com.matei.backend.dto.response.artist.ArtistResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenreResponseDto {
    private UUID id;
    private String name;
    private List<ArtistResponseDto> artists;
}
