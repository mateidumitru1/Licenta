package com.matei.backend.controller;

import com.matei.backend.dto.response.statistics.StatisticsResponseDto;
import com.matei.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/statistics")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<StatisticsResponseDto> getTotalUsers() {
        return ResponseEntity.ok(statisticsService.getStatistics());
    }
}
