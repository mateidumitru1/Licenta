package com.matei.backend.controller;

import com.matei.backend.service.DataAddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/init")
public class DataAddingController {
     private final DataAddingService dataAddingService;

     @PostMapping
     public ResponseEntity<Void> addPlaceAndEventData() {
         dataAddingService.addPlaceAndEventData();
         return ResponseEntity.noContent().build();
     }
}
