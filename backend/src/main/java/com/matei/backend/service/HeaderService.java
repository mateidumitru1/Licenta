package com.matei.backend.service;

import com.matei.backend.dto.response.header.HeaderResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HeaderService {
    private final LocationService locationService;
    private final ArtistService artistService;
    private final BroadGenreService broadGenreService;
    private final ShoppingCartService shoppingCartService;

    public HeaderResponseDto getHeaderData(String userId) {
        if(Objects.equals(userId, "")) {
            return HeaderResponseDto.builder()
                    .locations(locationService.getHeaderLocations())
                    .artists(artistService.getHeaderArtists())
                    .broadGenres(broadGenreService.getHeaderBroadGenres())
                    .shoppingCartSize(0)
                    .build();
        }
        return HeaderResponseDto.builder()
                .locations(locationService.getHeaderLocations())
                .artists(artistService.getHeaderArtists())
                .broadGenres(broadGenreService.getHeaderBroadGenres())
                .shoppingCartSize(shoppingCartService.getShoppingCartSize(UUID.fromString(userId)))
                .build();
    }
}
