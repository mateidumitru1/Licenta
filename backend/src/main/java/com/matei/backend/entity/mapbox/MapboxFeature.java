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
public class MapboxFeature {
    private String id;
    private String type;
    private List<String> placeType;
    private double relevance;
    private MapboxProperties properties;
    private String text;
    private String placeName;
    private String matchingText;
    private String matchingPlaceName;
    private List<Double> center;
    private MapboxGeometry geometry;
    private String address;
    private List<MapboxContext> context;
}
