package com.matei.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.Location;
import com.matei.backend.repository.EventRepository;
import com.matei.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DatabaseInitService {
    private final LocationRepository locationRepository;
    private final EventRepository eventRepository;
    private final ImageService imageService;

    private final ObjectMapper objectMapper;

    public void addLocationAndEventData() {
        try {
            ClassPathResource jsonResource = new ClassPathResource("locations.json");
            File locationJson = jsonResource.getFile();
            Location[] locations = objectMapper.readValue(locationJson, Location[].class);

            List<Location> locationList = Arrays.stream(locations).toList();
            locationList.forEach(location -> {
                try {
                    location.setImageUrl(imageService.saveImage("location-images", location.getName()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            locationRepository.saveAll(locationList);

            File eventsJson = ResourceUtils.getFile("classpath:events.json");
            Event[] events = objectMapper.readValue(eventsJson, Event[].class);

            List<Event> eventList = Arrays.stream(events).map(event -> {
                event.setLocation(locationList
                        .stream()
                        .filter(location -> location.getName().equals(event.getLocation().getName()))
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
