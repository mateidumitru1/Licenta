package com.matei.backend.service.util;

import com.matei.backend.dto.response.searchResult.SearchResultResponseDto;
import com.matei.backend.service.ArtistService;
import com.matei.backend.service.EventService;
import com.matei.backend.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SearchService {
    private final LocationService locationService;
    private final EventService eventService;
    private final ArtistService artistService;

    public SearchResultResponseDto search(String query) {
        return SearchResultResponseDto.builder()
                .locationList(locationService.searchLocations(query))
                .eventList(eventService.searchEvents(query))
                .artistList(artistService.searchArtists(query))
                .build();
    }
}
