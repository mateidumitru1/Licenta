package com.matei.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ping")
public class PingController {
    @RequestMapping
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Server is running!");
    }
}
