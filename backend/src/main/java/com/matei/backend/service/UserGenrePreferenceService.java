package com.matei.backend.service;

import com.matei.backend.dto.response.preference.UserGenrePreferenceResponseDto;
import com.matei.backend.dto.response.shoppingCart.ShoppingCartItemResponseDto;
import com.matei.backend.entity.User;
import com.matei.backend.entity.UserGenrePreference;
import com.matei.backend.repository.UserGenrePreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserGenrePreferenceService {
    private final UserGenrePreferenceRepository userGenrePreferenceRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    private final Map<String, String> genreMapping = new HashMap<>() {{
        put("rock", "rock");
        put("jazz", "jazz & blues");
        put("blues", "jazz & blues");
        put("soul", "jazz & blues");
        put("r&b", "jazz & blues");
        put("pop", "pop & dance");
        put("dance", "pop & dance");
        put("electronic", "pop & dance");
        put("classical", "classical");
        put("opera", "classical");
        put("hip hop", "hip hop & rap");
        put("rap", "hip hop & rap");
        put("funk", "funk");
        put("alternative", "alternative");
        put("alt", "alternative");
        put("punk", "punk");
        put("metal", "metal");
        put("death", "metal");
        put("indie", "indie");
        put("country", "country");
        put("reggae", "reggae");
        put("manele", "manele");
        put("stand up", "comedy");
        put("comedy", "comedy");
        put("theatre", "theatre");
        put("musical", "theatre");
        put("festival", "festival");
        put("carnival", "festival");
        put("exhibition", "exhibition");
        put("museum", "exhibition");
        put("conference", "conference");
        put("seminar", "conference");
        put("sport", "sport");
        put("fitness", "sport");
    }};

    public List<UserGenrePreferenceResponseDto> getUserGenrePreferences(UUID userId) {
        return userGenrePreferenceRepository
                .findByUser(Optional.of(userService.getUserById(userId))
                        .map(u -> modelMapper.map(u, User.class)).orElseThrow(() -> new RuntimeException("User not found")))
                .orElseThrow(() -> new RuntimeException("User genre preferences not found")).stream()
                .map(userGenrePreference -> modelMapper.map(userGenrePreference, UserGenrePreferenceResponseDto.class))
                .toList();
    }

    public void updateUserGenrePreferences(UUID userId, List<ShoppingCartItemResponseDto> shoppingCartItemList) {
        Map<String, Long> genreCountMap = calculateGenreCountMap(shoppingCartItemList);
        Map<String, Double> genrePercentageMap = calculateGenrePercentages(genreCountMap);

        User user = Optional.of(userService.getUserById(userId))
                .map(u -> modelMapper.map(u, User.class))
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserGenrePreference> existingGenrePreferences = userGenrePreferenceRepository.findByUser(user)
                .orElse(new ArrayList<>());

        updateExistingGenrePreferences(existingGenrePreferences, genreCountMap);

        List<UserGenrePreference> newGenrePreferences = createNewGenrePreferences(genrePercentageMap, genreCountMap, existingGenrePreferences);

        existingGenrePreferences.addAll(newGenrePreferences);

        updateMergedGenrePreferences(existingGenrePreferences);

        userGenrePreferenceRepository.saveAll(existingGenrePreferences);
    }

    private List<UserGenrePreference> createNewGenrePreferences(Map<String, Double> genrePercentageMap,
                                                                Map<String, Long> genreCountMap,
                                                                List<UserGenrePreference> existingGenrePreferences) {
        return genrePercentageMap.entrySet().stream()
                .filter(entry -> existingGenrePreferences.stream()
                        .noneMatch(pref -> pref.getBroadGenre().equals(entry.getKey())))
                .map(entry -> UserGenrePreference.builder()
                        .user(existingGenrePreferences.get(0).getUser())
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

    private String mapToBroadGenre(String specificGenre) {
        String lowercaseGenre = specificGenre.toLowerCase();
        for (Map.Entry<String, String> entry : genreMapping.entrySet()) {
            if (lowercaseGenre.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "other";
    }

    private Map<String, Long> calculateGenreCountMap(List<ShoppingCartItemResponseDto> shoppingCartItemList) {
        Map<String, Long> genreCountMap = new HashMap<>();

        shoppingCartItemList.forEach(shoppingCartItem -> {
            if (shoppingCartItem.getTicketType().getEvent().getArtistList().isEmpty()) {
                if (isStandUpEvent(shoppingCartItem)) {
                    genreCountMap.put("stand up", genreCountMap.getOrDefault("stand up", 0L) + 1);
                } else {
                    genreCountMap.put("other", genreCountMap.getOrDefault("other", 0L) + 1);
                }
            }
            else {
                shoppingCartItem.getTicketType().getEvent().getArtistList().forEach(artist -> {
                    if (!artist.getGenreList().isEmpty()) {
                        artist.getGenreList().forEach(genreDto -> {
                            String specificGenre = genreDto.getName().toLowerCase();
                            String broadGenre = mapToBroadGenre(specificGenre);
                            genreCountMap.put(broadGenre, genreCountMap.getOrDefault(broadGenre, 0L) + 1);
                        });
                    } else if (isStandUpEvent(shoppingCartItem)) {
                        genreCountMap.put("stand up", genreCountMap.getOrDefault("stand up", 0L) + 1);
                    } else {
                        genreCountMap.put("other", genreCountMap.getOrDefault("other", 0L) + 1);
                    }
                });
            }
        });

        return genreCountMap;
    }

    private boolean isStandUpEvent(ShoppingCartItemResponseDto shoppingCartItem) {
        String locationName = shoppingCartItem.getTicketType().getEvent().getLocation().getName();
        return "The Fool".equals(locationName) || "Club 99".equals(locationName);
    }
}
