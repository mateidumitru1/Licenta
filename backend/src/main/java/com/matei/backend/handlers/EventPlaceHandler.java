package com.matei.backend.handlers;

import com.matei.backend.entity.Event;
import com.matei.backend.entity.Place;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventPlaceHandler {
    Event event;
    Place place;
}
