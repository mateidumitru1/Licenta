package com.matei.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matei.backend.dto.request.artist.ArtistCreationRequestDto;
import com.matei.backend.dto.request.artist.ArtistUpdateRequestDto;
import com.matei.backend.dto.request.genre.GenreRequestDto;
import com.matei.backend.dto.response.artist.ArtistPageWithCountResponseDto;
import com.matei.backend.dto.response.artist.ArtistResponseDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventGenreResponseDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.entity.Artist;
import com.matei.backend.entity.Genre;
import com.matei.backend.exception.artist.ArtistAlreadyExistsException;
import com.matei.backend.exception.artist.ArtistNotFoundException;
import com.matei.backend.exception.genre.GenreNotFoundException;
import com.matei.backend.repository.ArtistRepository;
import com.matei.backend.repository.GenreRepository;
import com.matei.backend.service.util.ImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final ImageService imageService;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;


    public ArtistPageWithCountResponseDto createArtist(ArtistCreationRequestDto artistCreationRequestDto, int page, int size) throws IOException {
        artistRepository.findByName(artistCreationRequestDto.getName()).ifPresent(artist -> {
                    throw new ArtistAlreadyExistsException("Artist with name " + artistCreationRequestDto.getName() + " already exists");});

        var genreList = getGenreList(artistCreationRequestDto.getGenreList()).stream().toList();

        var existingGenres = genreRepository.findAllByNameIn(genreList.stream()
                .map(GenreRequestDto::getName)
                .toList());

        var artist = artistRepository.save(Artist.builder()
                .name(artistCreationRequestDto.getName())
                .genreList(existingGenres.stream()
                        .map(genre -> modelMapper.map(genre, Genre.class))
                        .toList())
                .imageUrl(imageService.saveImage("artist-images", artistCreationRequestDto.getImage()))
                .createdAt(LocalDateTime.now())
                .build());

        genreRepository.saveAll(existingGenres.stream()
                .peek(genre -> {
                    if (genre.getArtists() == null) {
                        genre.setArtists(new ArrayList<>(List.of(artist)));
                    } else {
                        genre.getArtists().add(artist);
                    }
                })
                .toList());

        return getAllArtistsPaginatedManage(page, size);
    }

    public ArtistResponseDto getArtistById(UUID id) {
        var artist = artistRepository.findById(id).orElseThrow(() -> new ArtistNotFoundException("Artist not found"));

        var genreList = artist.getGenreList().stream()
                .map(genre -> modelMapper.map(genre, GenreWithoutArtistListResponseDto.class))
                .toList();

        var eventList = artist.getEventList().stream()
                .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class))
                .toList();

        var artistResponseDto = modelMapper.map(artist, ArtistResponseDto.class);
        artistResponseDto.setGenreList(genreList);
        artistResponseDto.setEventList(eventList);

        return artistResponseDto;
    }

    public List<ArtistWithoutEventGenreResponseDto> getAllArtistsWithoutEventGenre() {
        return artistRepository.findAll().stream()
                .map(artist -> modelMapper.map(artist, ArtistWithoutEventGenreResponseDto.class))
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
                            .map(event -> modelMapper.map(event, EventWithoutTicketArtistResponseDto.class))
                            .toList());
                    return artistResponseDto;
                })
                .toList();
    }

    public ArtistResponseDto updateArtist(ArtistUpdateRequestDto artistUpdateRequestDto) throws IOException {
        var artist = artistRepository.findById(artistUpdateRequestDto.getId())
                .orElseThrow(() -> new ArtistNotFoundException("Artist not found"));

        String imageUrl = artistUpdateRequestDto.getImageUrl();
        if (artistUpdateRequestDto.getImage() != null) {
            if (imageUrl != null) {
                imageService.deleteImage(imageUrl);
            }
            imageUrl = imageService.saveImage("artist-images", artistUpdateRequestDto.getImage());
        }

        var updatedGenres = getGenreList(artistUpdateRequestDto.getGenreList());

        artist.setName(artistUpdateRequestDto.getName());
        artist.setImageUrl(imageUrl);
        List<Genre> updatedGenreList = updatedGenres.stream()
                .map(genreRequestDto -> modelMapper.map(genreRequestDto, Genre.class))
                .toList();
        List<Genre> existingGenres = new ArrayList<>(updatedGenreList);

        artist.setGenreList(existingGenres);

        var updatedArtist = artistRepository.save(artist);

        updateGenreAssociations(existingGenres, updatedArtist);

        return modelMapper.map(updatedArtist, ArtistResponseDto.class);
    }

    private void updateGenreAssociations(List<Genre> updatedGenres, Artist updatedArtist) {
        List<Genre> currentGenres = genreRepository.findAllByArtistId(updatedArtist.getId());

        List<Genre> genresRemove = currentGenres.stream()
                .filter(genre -> !updatedGenres.contains(genre))
                .toList();

        List<Genre> genresToAdd = updatedGenres.stream()
                .filter(genre -> !currentGenres.contains(genre))
                .toList();

        genresRemove.forEach(genre -> {
            genre.getArtists().remove(updatedArtist);
            genreRepository.save(genre);
        });

        genresToAdd.forEach(genre -> {
            genre.getArtists().add(updatedArtist);
            genreRepository.save(genre);
        });
    }

    public ArtistPageWithCountResponseDto deleteArtistById(UUID id, int page, int size) {
        imageService.deleteImage(artistRepository.findById(id)
                .orElseThrow(() -> new ArtistNotFoundException("Artist not found")).getImageUrl());
        artistRepository.deleteById(id);
        return getAllArtistsPaginatedManage(page, size);
    }

    public List<Artist> getArtistsByIdList(List<UUID> artistIds) {
        return artistRepository.findAllById(artistIds);
    }

    private Set<GenreRequestDto> getGenreList(String genreList) {
        try {
            GenreRequestDto[] genreArray = objectMapper.readValue(genreList, GenreRequestDto[].class);
            return new HashSet<>(Arrays.asList(genreArray));
        } catch (IOException e) {
            throw new RuntimeException("Error parsing genre list");
        }
    }

    public ArtistPageWithCountResponseDto getAllArtistsPaginatedManage(int page, int size) {
        Page<Artist> artistPage = artistRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return ArtistPageWithCountResponseDto.builder()
                .artistPage(artistPage.map(artist -> modelMapper.map(artist, ArtistWithoutEventResponseDto.class)))
                .count(artistRepository.count())
                .build();
    }

    public ArtistPageWithCountResponseDto getFilteredArtistsPaginatedManage(int page, int size, String filter, String search) {
        Page<Artist> artistPage = artistRepository.findFilteredArtistsPaginated(filter, search, PageRequest.of(page, size));
        return ArtistPageWithCountResponseDto.builder()
                .artistPage(artistPage.map(artist -> modelMapper.map(artist, ArtistWithoutEventResponseDto.class)))
                .count(artistRepository.countFilteredArtists(filter, search))
                .build();
    }

    public List<ArtistWithoutEventGenreResponseDto> searchArtists(String query) {
        return artistRepository.findByNameContainingIgnoreCase(query, PageRequest.of(0, 3)).stream()
                .map(artist -> modelMapper.map(artist, ArtistWithoutEventGenreResponseDto.class))
                .toList();
    }

    public List<String> getAllArtistNames() {
        return artistRepository.findAllByOrderByName().orElseThrow(() -> new ArtistNotFoundException("Artists not found"))
                .stream()
                .map(Artist::getName)
                .toList();
    }
}
