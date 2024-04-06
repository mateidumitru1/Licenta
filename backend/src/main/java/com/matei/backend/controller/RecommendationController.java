package com.matei.backend.controller;

import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.event.RecommendedEventResponseDto;
import com.matei.backend.service.RecommendationService;
import com.matei.backend.service.auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<Set<RecommendedEventResponseDto>> getRecommendedEvents(@RequestHeader("Authorization") String token){
        return ResponseEntity.ok(recommendationService.getRecommendedEvents(jwtService.extractId(token)));
    }
}
