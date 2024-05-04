package com.matei.backend.controller;

import com.matei.backend.dto.response.broadGenre.BroadGenreResponseDto;
import com.matei.backend.service.BroadGenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/broad-genres")
public class BroadGenreController {
    private final BroadGenreService broadGenreService;

    @GetMapping
    public ResponseEntity<List<BroadGenreResponseDto>> getAllBroadGenres() {
        return ResponseEntity.ok(broadGenreService.getAllBroadGenres());
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllBroadGenreNames() {
        return ResponseEntity.ok(broadGenreService.getAllBroadGenreNames());
    }
}
