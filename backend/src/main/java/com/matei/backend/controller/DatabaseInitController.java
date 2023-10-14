package com.matei.backend.controller;

import com.matei.backend.service.DatabaseInitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileNotFoundException;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/init")
public class DatabaseInitController {
     private final DatabaseInitService databaseInitService;

     @PostMapping
     public ResponseEntity<Void> addPlaceAndEventData() {
         databaseInitService.addPlaceAndEventData();
         return ResponseEntity.ok().build();
     }
}
