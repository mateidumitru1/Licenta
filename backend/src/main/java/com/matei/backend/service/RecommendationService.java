package com.matei.backend.service;

import com.matei.backend.dto.response.event.RecommendedEventResponseDto;
import com.matei.backend.dto.response.order.OrderResponseDto;
import com.matei.backend.dto.response.preference.UserGenrePreferenceResponseDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final EventService eventService;
    private final UserGenrePreferenceService userGenrePreferenceService;
    private final ModelMapper modelMapper;

    public Set<RecommendedEventResponseDto> getRecommendedEvents(UUID currentUserId) {
        List<UserGenrePreferenceResponseDto> userGenrePreferences = userGenrePreferenceService.getUserGenrePreferences(currentUserId);

        Set<RecommendedEventResponseDto> recommendedEvents = new HashSet<>();
        var availableEvents = eventService.getAllEventsToRecommend(userGenrePreferences.stream()
                .map(UserGenrePreferenceResponseDto::getBroadGenre)
                .toList());

        userGenrePreferences.forEach(userGenrePreference -> {
            int numberOfEventsToRecommend = (int) Math.round(userGenrePreference.getPercentage() / 100 * 10);

            List<RecommendedEventResponseDto> recommendedEventsToReturn = availableEvents.stream()
                    .filter(event -> event.getBroadGenre().equals(userGenrePreference.getBroadGenre()))
                    .limit(numberOfEventsToRecommend)
                    .toList();

            recommendedEvents.addAll(recommendedEventsToReturn);
        });


        return recommendedEvents;
    }
}
