package com.matei.backend.service;

import com.matei.backend.dto.response.event.RecommendedEventResponseDto;
import com.matei.backend.dto.response.order.OrderResponseDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final EventService eventService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public Set<RecommendedEventResponseDto> getRecommendedEvents(UUID currentUserId) {
        var user = userService.getUserById(currentUserId);
        List<OrderResponseDto> pastOrders = user.getOrderList();
        Map<String, Integer> genreCountMap = new HashMap<>();

        pastOrders.stream()
                .flatMap(order -> order.getTicketList().stream())
                .map(ticket -> eventService.getEventById(ticket.getTicketType().getEvent().getId()))
                .filter(Objects::nonNull)
                .forEach(event -> {
                    event.getArtistList().forEach(artist -> {
                        artist.getGenreList().forEach(genre -> {
                            String broadGenre = mapToBroadGenre(genre.getName());
                            genreCountMap.put(broadGenre, genreCountMap.getOrDefault(broadGenre, 0) + 1);
                        });
                    });
                });

        Map<String, Double> genrePercentageMap = new HashMap<>();
        int totalEvents = genreCountMap.values().stream().mapToInt(Integer::intValue).sum();
        genreCountMap.forEach((genre, count) -> {
            double percentage = (double) count / totalEvents * 100;
            genrePercentageMap.put(genre, percentage);
        });


        Set<RecommendedEventResponseDto> recommendedEvents = new HashSet<>();
        var availableEvents = eventService.getAllEventsWithoutLocationTicket();

        genrePercentageMap.forEach((genre, percentage) -> {
            int numberOfEventsToRecommend = (int) Math.round(percentage / 100 * 10);

            availableEvents.stream()
                    .filter(event -> event.getArtistList().stream()
                            .flatMap(artist -> artist.getGenreList().stream())
                            .anyMatch(genreDto -> mapToBroadGenre(genreDto.getName()).equalsIgnoreCase(genre)) && !recommendedEvents.contains(modelMapper.map(event, RecommendedEventResponseDto.class)))
                    .map(event -> {
                        var recommendedEvent = modelMapper.map(event, RecommendedEventResponseDto.class);
                        recommendedEvent.setBroadGenre(genre);
                        return recommendedEvent;
                    })
                    .limit(numberOfEventsToRecommend)
                    .forEach(recommendedEvents::add);
        });

        return recommendedEvents;
    }

    private String mapToBroadGenre(String specificGenre) {
        String lowercaseGenre = specificGenre.toLowerCase();
        if (lowercaseGenre.contains("rock")) {
            return "rock";
        } else if (lowercaseGenre.contains("jazz") || lowercaseGenre.contains("blues") || lowercaseGenre.contains("soul") || lowercaseGenre.contains("r&b")) {
            return "jazz & blues";
        }
        else if (lowercaseGenre.contains("pop") || lowercaseGenre.contains("dance") || lowercaseGenre.contains("electronic")) {
            return "pop & dance";
        } else if (lowercaseGenre.contains("classical") || lowercaseGenre.contains("opera")) {
            return "classical";
        } else if (lowercaseGenre.contains("hip hop") || lowercaseGenre.contains("rap")) {
            return "hip hop & rap";
        } else if (lowercaseGenre.contains("funk")) {
            return "funk";
        } else if (lowercaseGenre.contains("metal") || lowercaseGenre.contains("death")) {
            return "metal";
        } else if (lowercaseGenre.contains("indie")) {
            return "indie";
        } else if (lowercaseGenre.contains("country")) {
            return "country";
        } else if (lowercaseGenre.contains("reggae")) {
            return "reggae";
        } else if (lowercaseGenre.contains("manele")) {
            return "manele";
        } else if (lowercaseGenre.contains("stand up") || lowercaseGenre.contains("comedy")) {
            return "comedy";
        } else if (lowercaseGenre.contains("theatre") || lowercaseGenre.contains("musical")) {
            return "theatre";
        } else if (lowercaseGenre.contains("festival") || lowercaseGenre.contains("carnival")) {
            return "festival";
        } else if (lowercaseGenre.contains("exhibition") || lowercaseGenre.contains("museum")) {
            return "exhibition";
        } else if (lowercaseGenre.contains("conference") || lowercaseGenre.contains("seminar")) {
            return "conference";
        } else if (lowercaseGenre.contains("sport") || lowercaseGenre.contains("fitness")) {
            return "sport";
        } else {
            return "other";
        }
    }
}
