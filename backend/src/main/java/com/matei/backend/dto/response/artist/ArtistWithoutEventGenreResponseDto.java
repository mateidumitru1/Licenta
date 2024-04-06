package com.matei.backend.dto.response.artist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistWithoutEventGenreResponseDto {
    private UUID id;
    private String name;
}
