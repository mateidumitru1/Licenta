package com.matei.backend.dto.request.artist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistCreationRequestDto {
    private String name;
    private String genre;
    private String imageUrl;
    private String eventIdList;
    private String genreIdList;
}
