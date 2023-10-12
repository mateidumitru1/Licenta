package com.matei.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Place;
import com.matei.backend.repository.EventRepository;
import com.matei.backend.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DataAddingService {
    private final PlaceRepository placeRepository;
    private final EventRepository eventRepository;

    private final ObjectMapper objectMapper;


    public void addPlaceAndEventData() {
        try {
            ClassPathResource jsonResource = new ClassPathResource("places.json");
            File placesJson = jsonResource.getFile();
            Place[] places = objectMapper.readValue(placesJson, Place[].class);

            List<Place> placeList = Arrays.stream(places)
                    .map(place -> placeRepository.save(place))
                    .toList();

            File eventsJson = ResourceUtils.getFile("classpath:events.json");
            Event[] events = objectMapper.readValue(eventsJson, Event[].class);

            List<Event> eventList = Arrays.stream(events).map(event -> {
                event.setPlace(placeList
                        .stream()
                        .filter(place -> place.getName().equals(event.getPlace().getName()))
                        .findFirst()
                        .orElseThrow());
                return event;
            }).toList();

            eventRepository.saveAll(eventList);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
