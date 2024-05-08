package com.matei.backend.service;

import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.preference.UserGenrePreferenceResponseDto;
import com.matei.backend.entity.User;
import com.matei.backend.entity.UserGenrePreference;
import com.matei.backend.repository.UserGenrePreferenceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserGenrePreferenceService {
    private final UserGenrePreferenceRepository userGenrePreferenceRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public List<UserGenrePreferenceResponseDto> getUserGenrePreferences(UUID userId) {
        return userGenrePreferenceRepository
                .findByUser(Optional.of(userService.getUserWithOrdersById(userId))
                        .map(u -> modelMapper.map(u, User.class)).orElseThrow(() -> new RuntimeException("User not found")))
                .orElseThrow(() -> new RuntimeException("User genre preferences not found")).stream()
                .map(userGenrePreference -> modelMapper.map(userGenrePreference, UserGenrePreferenceResponseDto.class))
                .toList();
    }

    public void updateUserGenrePreferences(UUID userId, Set<EventWithoutTicketArtistResponseDto> eventSet) {
        User user = Optional.of(userService.getUserWithOrdersById(userId))
                .map(u -> modelMapper.map(u, User.class))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Long> genreCountMap = calculateGenreCountMap(eventSet);
        Map<String, Double> genrePercentageMap = calculateGenrePercentages(genreCountMap);

        List<UserGenrePreference> existingGenrePreferences = userGenrePreferenceRepository.findByUser(user)
                .orElse(new ArrayList<>());

        updateExistingGenrePreferences(existingGenrePreferences, genreCountMap);

        List<UserGenrePreference> newGenrePreferences = createNewGenrePreferences(genrePercentageMap, genreCountMap, existingGenrePreferences, user);

        existingGenrePreferences.addAll(newGenrePreferences);

        updateMergedGenrePreferences(existingGenrePreferences);

        userGenrePreferenceRepository.saveAll(existingGenrePreferences);
        System.out.println("User genre preferences updated");
    }

    private List<UserGenrePreference> createNewGenrePreferences(Map<String, Double> genrePercentageMap,
                                                                Map<String, Long> genreCountMap,
                                                                List<UserGenrePreference> existingGenrePreferences,
                                                                User user) {
        return genrePercentageMap.entrySet().stream()
                .filter(entry -> existingGenrePreferences.stream()
                        .noneMatch(pref -> pref.getBroadGenre().equals(entry.getKey())))
                .map(entry -> UserGenrePreference.builder()
                        .user(user)
                        .broadGenre(entry.getKey())
                        .percentage(entry.getValue())
                        .count(genreCountMap.get(entry.getKey()))
                        .build())
                .toList();
    }

    private void updateExistingGenrePreferences(List<UserGenrePreference> existingGenrePreferences, Map<String, Long> genreCountMap) {
        existingGenrePreferences.forEach(existingPreference -> {
            String broadGenre = existingPreference.getBroadGenre();
            Long newCount = genreCountMap.getOrDefault(broadGenre, 0L);
            existingPreference.setCount(existingPreference.getCount() + newCount);
        });
    }

    private void updateMergedGenrePreferences(List<UserGenrePreference> existingGenrePreferences) {
        Map<String, Long> mergedGenreCountMap = existingGenrePreferences.stream()
                .collect(Collectors.groupingBy(UserGenrePreference::getBroadGenre,
                        Collectors.summingLong(UserGenrePreference::getCount)));

        Map<String, Double> mergedGenrePercentageMap = calculateGenrePercentages(mergedGenreCountMap);

        existingGenrePreferences.forEach(existingPreference -> {
            String broadGenre = existingPreference.getBroadGenre();
            Double newPercentage = mergedGenrePercentageMap.get(broadGenre);
            existingPreference.setPercentage(newPercentage);
        });
    }

    private Map<String, Double> calculateGenrePercentages(Map<String, Long> genreCountMap) {
        Map<String, Double> genrePercentageMap = new HashMap<>();
        int totalEvents = genreCountMap.values().stream().mapToInt(Long::intValue).sum();

        genreCountMap.forEach((genre, count) -> {
            double percentage = (double) count / totalEvents * 100;
            genrePercentageMap.put(genre, percentage);
        });

        return genrePercentageMap;
    }

    private Map<String, Long> calculateGenreCountMap(Set<EventWithoutTicketArtistResponseDto> eventSet) {
        Map<String, Long> genreCountMap = new HashMap<>();

        eventSet.forEach(event -> {
            genreCountMap.put(event.getBroadGenre().getName(), genreCountMap.getOrDefault(event.getBroadGenre().getName(), 0L) + 1);
        });

        return genreCountMap;
    }
}
