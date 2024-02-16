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
public class MapboxGeometry {
    private String type;
    private List<Double> coordinates;
    private boolean interpolated;
    private boolean omitted;
}
