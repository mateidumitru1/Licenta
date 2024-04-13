package com.matei.backend.controller;

import com.matei.backend.dto.response.genre.GenreWithoutArtistListResponseDto;
import com.matei.backend.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreService genreService;

    @GetMapping
    public ResponseEntity<List<GenreWithoutArtistListResponseDto>> getAllGenres() {
        return ResponseEntity.ok(genreService.getAllGenres());
    }
}
