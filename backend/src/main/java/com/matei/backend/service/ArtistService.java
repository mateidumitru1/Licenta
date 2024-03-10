package com.matei.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.artist.ArtistCreationRequestDto;
import com.matei.backend.dto.request.artist.ArtistUpdateRequestDto;
import com.matei.backend.dto.response.artist.ArtistResponseDto;
import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.entity.Artist;
import com.matei.backend.entity.Genre;
import com.matei.backend.exception.ArtistAlreadyExistsException;
import com.matei.backend.exception.ArtistNotFoundException;
import com.matei.backend.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final GenreService genreService;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;


    public ArtistResponseDto createArtist(ArtistCreationRequestDto artistCreationRequestDto) {
        artistRepository.findByName(artistCreationRequestDto.getName()).ifPresent(artist -> {
                    throw new ArtistAlreadyExistsException("Artist with name " + artistCreationRequestDto.getName() + " already exists");});

        var genres = getGenreIds(artistCreationRequestDto.getGenreIdList()).stream()
                .map(genreId -> modelMapper.map(genreService.getGenreById(genreId), Genre.class))
                .toList();


        return modelMapper.map(artistRepository.save(Artist.builder()
                .name(artistCreationRequestDto.getName())
                .genreList(genres)
                .imageUrl(artistCreationRequestDto.getImageUrl())
                .build()), ArtistResponseDto.class);
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
                .map(artist -> modelMapper.map(artist, ArtistResponseDto.class))
                .toList();
    }

    public ArtistResponseDto updateArtistById(UUID uuid, ArtistUpdateRequestDto artistUpdateRequestDto) {
        Artist artist = artistRepository.findById(uuid).orElseThrow(() ->
                new ArtistNotFoundException("Artist not found"));

        var genres = getGenreIds(artistUpdateRequestDto.getGenreIdList()).stream()
                .map(genreId -> modelMapper.map(genreService.getGenreById(genreId), Genre.class))
                .toList();

        artist.setName(artistUpdateRequestDto.getName());
        artist.setGenreList(genres);
        artist.setImageUrl(artistUpdateRequestDto.getImageUrl());

        return modelMapper.map(artistRepository.save(artist), ArtistResponseDto.class);
    }

    public void deleteArtistById(UUID id) {
        artistRepository.deleteById(id);
    }

    private List<UUID> getGenreIds(String genreIdList) {
        return List.of(objectMapper.convertValue(genreIdList, UUID[].class));
    }
}
