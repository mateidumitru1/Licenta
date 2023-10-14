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

import java.io.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DatabaseInitService {
    private final PlaceRepository placeRepository;
    private final EventRepository eventRepository;
    private final ImageService imageService;

    private final ObjectMapper objectMapper;

    public void addPlaceAndEventData() {
        try {
            ClassPathResource jsonResource = new ClassPathResource("places.json");
            File placesJson = jsonResource.getFile();
            Place[] places = objectMapper.readValue(placesJson, Place[].class);



            List<Place> placeList = Arrays.stream(places).toList();
            placeList.forEach(place -> {
                try {
                    place.setImageUrl(imageService.saveImage("place-images", place.getName()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            placeRepository.saveAll(placeList);

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

            eventList.forEach(event -> {
                try {
                    event.setImageUrl(imageService.saveImage("event-images", event.getTitle()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            eventRepository.saveAll(eventList);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
