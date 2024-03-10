package com.matei.backend.dto.response.genre;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenreWithoutArtistListResponseDto {
    private UUID id;
    private String name;
}
