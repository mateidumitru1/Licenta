package com.matei.backend.controller;

import com.matei.backend.dto.response.searchResult.SearchResultResponseDto;
import com.matei.backend.service.util.SearchService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResultResponseDto> search(@PathParam("query") String query) {
        return ResponseEntity.ok(searchService.search(query));
    }
}
