package com.matei.backend.service.util;

import com.matei.backend.entity.Event;
import com.matei.backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static java.util.Map.entry;

@Service
@RequiredArgsConstructor
public class BroadGenreMapperService {
    private final ArtistService artistService;

    private static final Map<String, String> genreMapping = Map.ofEntries(
            entry("rock", "rock"),
            entry("jazz", "jazz & blues"),
            entry("blues", "jazz & blues"),
            entry("soul", "jazz & blues"),
            entry("r&b", "jazz & blues"),
            entry("strut", "jazz & blues"),
            entry("pop", "pop & dance"),
            entry("dance", "pop & dance"),
            entry("rave", "electronic"),
            entry("dnb", "electronic"),
            entry("downtempo", "electronic"),
            entry("electronic", "electronic"),
            entry("classical", "classical"),
            entry("opera", "classical"),
            entry("hop", "hip hop & rap"),
            entry("hip", "hip hop & rap"),
            entry("hip hop", "hip hop & rap"),
            entry("rap", "hip hop & rap"),
            entry("dubstep", "hip hop & rap"),
            entry("funk", "funk"),
            entry("alternative", "alternative"),
            entry("alt", "alternative"),
            entry("grunge", "alternative"),
            entry("punk", "punk"),
            entry("emo", "punk"),
            entry("hardcore", "punk"),
            entry("voidgaze", "metal"),
            entry("metalcore", "metal"),
            entry("metal", "metal"),
            entry("death", "metal"),
            entry("thrash", "metal"),
            entry("indie", "indie"),
            entry("psy", "indie"),
            entry("chill", "indie"),
            entry("ambient", "indie"),
            entry("wave", "indie"),
            entry("pixie", "indie"),
            entry("folk", "folk"),
            entry("balkan brass", "folk"),
            entry("country", "country"),
            entry("reggae", "reggae"),
            entry("manele", "manele"),
            entry("stand up", "comedy"),
            entry("comedy", "comedy"),
            entry("theatre", "theatre"),
            entry("musical", "theatre"),
            entry("festival", "festival"),
            entry("carnival", "festival"),
            entry("exhibition", "exhibition"),
            entry("museum", "exhibition"),
            entry("conference", "conference"),
            entry("seminar", "conference"),
            entry("sport", "sport"),
            entry("fitness", "sport")
    );

    public String getBroadGenre(String genre) {
        for (String key : genreMapping.keySet()) {
            if (genre.toLowerCase().contains(key)) {
                return genreMapping.get(key);
            }
        }
        return "other";
    }

    public String map (List<UUID> artistIdList, Event event) {
        var artistList = artistService.getArtistsByIdList(artistIdList);

        Map<String, Integer> genreCount = new HashMap<>();

        String broadGenre = "other";

        if (artistList == null || artistList.isEmpty()) {
            if (event.getLocation().getName().equals("The Fool") || event.getLocation().getName().equals("Club 99")) {
                broadGenre = "comedy";
            }
            return broadGenre;
        }

        artistList.forEach(artist -> {
            if (artist.getGenreList() == null || artist.getGenreList().isEmpty()) {
                genreCount.put("other", genreCount.getOrDefault("other", 0) + 1);
            }
            else {
                artist.getGenreList().forEach(genre -> {
                    String finalBroadGenre = getBroadGenre(genre.getName());
                    genreCount.put(finalBroadGenre, genreCount.getOrDefault(finalBroadGenre, 0) + 1);
                });
            }
        });

        return genreCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("other");
    }
}

