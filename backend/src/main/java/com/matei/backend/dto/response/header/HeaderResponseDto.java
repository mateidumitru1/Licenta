package com.matei.backend.dto.response.header;

import com.matei.backend.dto.response.artist.ArtistHeaderResponseDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventGenreResponseDto;
import com.matei.backend.dto.response.broadGenre.BroadGenreHeaderResponseDto;
import com.matei.backend.dto.response.location.LocationHeaderResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HeaderResponseDto {
    private List<LocationHeaderResponseDto> locations;
    private Map<Character, List<ArtistHeaderResponseDto>> artists;
    private List<BroadGenreHeaderResponseDto> broadGenres;
    private Integer shoppingCartSize;
}
