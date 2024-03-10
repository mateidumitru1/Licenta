package com.matei.backend.service;

import com.matei.backend.dto.request.genre.GenreCreationRequestDto;
import com.matei.backend.dto.response.genre.GenreResponseDto;
import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.entity.Genre;
import com.matei.backend.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final GenreRepository genreRepository;
    private final ModelMapper modelMapper;

    public GenreResponseDto createGenre(GenreCreationRequestDto genre) {
        return modelMapper.map(genreRepository.save(Genre.builder()
                .name(genre.getName())
                .build()), GenreResponseDto.class);
    }

    public GenreWithoutArtistListResponseDto getGenreById(UUID id) {
        return modelMapper.map(genreRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Genre not found")), GenreWithoutArtistListResponseDto.class);
    }
}
