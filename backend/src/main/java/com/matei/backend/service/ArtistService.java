package com.matei.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.artist.ArtistCreationRequestDto;
import com.matei.backend.dto.request.artist.ArtistUpdateRequestDto;
import com.matei.backend.dto.request.genre.GenreRequestDto;
import com.matei.backend.dto.response.artist.ArtistResponseDto;
import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.entity.Artist;
import com.matei.backend.entity.Genre;
import com.matei.backend.exception.ArtistAlreadyExistsException;
import com.matei.backend.exception.ArtistNotFoundException;
import com.matei.backend.repository.ArtistRepository;
import com.matei.backend.repository.GenreRepository;
import com.matei.backend.service.util.ImageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final GenreService genreService;
    private final ImageService imageService;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;


    public ArtistResponseDto createArtist(ArtistCreationRequestDto artistCreationRequestDto) throws IOException {
        artistRepository.findByName(artistCreationRequestDto.getName()).ifPresent(artist -> {
                    throw new ArtistAlreadyExistsException("Artist with name " + artistCreationRequestDto.getName() + " already exists");});

        var genreList = getGenreList(artistCreationRequestDto.getGenreList());

        var artist = artistRepository.save(Artist.builder()
                .name(artistCreationRequestDto.getName())
                .genreList(genreList.stream()
                        .map(genre -> modelMapper.map(genre, Genre.class))
                        .toList())
                .imageUrl(imageService.saveImage("artist-images", artistCreationRequestDto.getImage()))
                .build());

        genreRepository.saveAll(artist.getGenreList().stream()
                .peek(genre -> {
                    if(genre.getArtists() == null) genre.setArtists(new ArrayList<>(List.of(artist)));
                    else {
                        genre.getArtists().add(artist);
                    }
                })
                .toList());

        return modelMapper.map(artist, ArtistResponseDto.class);
    }

    public ArtistResponseDto getArtistById(UUID id) {
        var artist = artistRepository.findById(id).orElseThrow(() -> new ArtistNotFoundException("Artist not found"));

        var genreList = artist.getGenreList().stream()
                .map(genre -> modelMapper.map(genre, GenreWithoutArtistListResponseDto.class))
                .toList();

        var eventList = artist.getEventList().stream()
                .map(event -> modelMapper.map(event, EventWithoutArtistListResponseDto.class))
                .toList();

        var artistResponseDto = modelMapper.map(artist, ArtistResponseDto.class);
        artistResponseDto.setGenreList(genreList);
        artistResponseDto.setEventList(eventList);

        return artistResponseDto;
    }

    public List<ArtistResponseDto> getAllArtists() {
        return artistRepository.findAll().stream()
                .map(artist -> modelMapper.map(artist, ArtistResponseDto.class))
                .toList();
    }

    public List<ArtistResponseDto> getAllArtistsByFirstLetter(String firstLetter) {
        return artistRepository.findAllByNameStartingWith(firstLetter).orElseThrow(() -> new ArtistNotFoundException("Artist not found"))
                .stream()
                .map(artist -> {
                    var artistResponseDto = modelMapper.map(artist, ArtistResponseDto.class);
                    artistResponseDto.setGenreList(artist.getGenreList().stream()
                            .map(genre -> modelMapper.map(genre, GenreWithoutArtistListResponseDto.class))
                            .toList());
                    artistResponseDto.setEventList(artist.getEventList().stream()
                            .map(event -> modelMapper.map(event, EventWithoutArtistListResponseDto.class))
                            .toList());
                    return artistResponseDto;
                })
                .toList();
    }

    public ArtistResponseDto updateArtist(ArtistUpdateRequestDto updatedArtist) throws IOException {
        var artist = artistRepository.findById(updatedArtist.getId())
                .orElseThrow(() -> new ArtistNotFoundException("Artist not found"));

        String imageUrl = updatedArtist.getImageUrl();
        if (updatedArtist.getImage() != null) {
            if (imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("artist-images", updatedArtist.getImage());
        }

        List<Genre> updatedGenres = getGenreList(updatedArtist.getGenreList()).stream()
                .map(genreRequestDto -> modelMapper.map(genreRequestDto, Genre.class))
                .toList();

        artist.setName(updatedArtist.getName());
        artist.setImageUrl(imageUrl);

        final Artist finalArtist = artist;
        List<Genre> genresToRemove = artist.getGenreList().stream()
                .filter(existingGenre -> !updatedGenres.contains(existingGenre))
                .peek(existingGenre -> {
                    existingGenre.getArtists().remove(finalArtist);
                    if (existingGenre.getArtists().isEmpty()) {
                        genreRepository.delete(existingGenre);
                    }
                })
                .toList();
        artist.getGenreList().removeAll(genresToRemove);

        updatedGenres.stream()
                .filter(newGenre -> !finalArtist.getGenreList().contains(newGenre))
                .forEach(newGenre -> {
                    List<Artist> artists = newGenre.getArtists();
                    if (artists == null) {
                        artists = new ArrayList<>();
                    }
                    artists.add(finalArtist);
                    newGenre.setArtists(artists);
                    finalArtist.getGenreList().add(newGenre);
                });

        artist = artistRepository.save(artist);
        genreRepository.saveAll(updatedGenres);

        return modelMapper.map(artist, ArtistResponseDto.class);
    }

    public void deleteArtistById(UUID id) {
        imageService.deleteImage(artistRepository.findById(id)
                .orElseThrow(() -> new ArtistNotFoundException("Artist not found")).getImageUrl());
        artistRepository.deleteById(id);
    }

    private List<GenreRequestDto> getGenreList(String genreList) {
        try {
            return List.of(objectMapper.readValue(genreList, GenreRequestDto[].class));
        } catch (IOException e) {
            throw new RuntimeException("Error parsing genre list");
        }
    }
}
