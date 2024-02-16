package com.matei.backend.entity.mapbox;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MapBoxGeocodingResponse {
    private String type;
    private List<String> query;
    private List<MapboxFeature> features;
    private String attribution;
}
