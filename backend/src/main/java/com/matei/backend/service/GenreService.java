package com.matei.backend.service;

import com.matei.backend.dto.request.genre.GenreCreationRequestDto;
import com.matei.backend.dto.response.genre.GenreResponseDto;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.entity.Genre;
import com.matei.backend.repository.GenreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class GenreService {
    private final GenreRepository genreRepository;
    private final ModelMapper modelMapper;

    public GenreResponseDto createGenre(GenreCreationRequestDto genre) {
        return modelMapper.map(genreRepository.save(Genre.builder()
                .name(genre.getName())
                .createdAt(LocalDateTime.now())
                .build()), GenreResponseDto.class);
    }

    public GenreWithoutArtistListResponseDto getGenreById(UUID id) {
        return modelMapper.map(genreRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Genre not found")), GenreWithoutArtistListResponseDto.class);
    }

    public List<GenreWithoutArtistListResponseDto> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genre -> modelMapper.map(genre, GenreWithoutArtistListResponseDto.class))
                .toList();
    }
}
