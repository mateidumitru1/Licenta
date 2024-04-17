package com.matei.backend.controller;

import com.matei.backend.dto.response.header.HeaderResponseDto;
import com.matei.backend.service.HeaderService;
import com.matei.backend.service.auth.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/header/data")
public class HeaderController {
    private final AuthenticationService authenticationService;
    private final HeaderService headerService;

    @GetMapping
    public ResponseEntity<HeaderResponseDto> getHeaderData() {
        if (authenticationService.isAuthenticated()) {
            return ResponseEntity.ok(headerService.getHeaderData(authenticationService.getUserId().toString()));
        }
        return ResponseEntity.ok(headerService.getHeaderData(""));
    }
}
