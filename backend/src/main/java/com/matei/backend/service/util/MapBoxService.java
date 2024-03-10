package com.matei.backend.service.util;

import com.matei.backend.entity.mapbox.MapBoxGeocodingResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class MapBoxService {
    private final String apiKey = System.getenv("MAPBOX_API_KEY");

    public MapBoxGeocodingResponse getCoordinates(String locationName) {
        String GEOCODING_API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        String url = GEOCODING_API_URL + locationName + ".json?access_token=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, MapBoxGeocodingResponse.class);
    }
}
