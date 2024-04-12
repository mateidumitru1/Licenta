package com.matei.backend.controller;

import com.matei.backend.dto.response.statistics.StatisticsResponseDto;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.exception.statistics.StatisticsFilterInvalidException;
import com.matei.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/statistics")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{filter}")
    public ResponseEntity<StatisticsResponseDto> getStatistics(@PathVariable String filter) {
        if(!List.of("all", "last-year", "last-3months", "last-month", "last-week", "last-day").contains(filter.toLowerCase()))
            throw new StatisticsFilterInvalidException("Statistics filter not found");
        filter = filter.replace("-", "_");
        return ResponseEntity.ok(statisticsService.getStatistics(StatisticsFilter.valueOf(filter.toUpperCase())));
    }
}
