package com.matei.backend.entity.mapbox;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MapboxContext {
    private String id;
    private String text;
    private String shortCode;
    private String wikidata;
}
