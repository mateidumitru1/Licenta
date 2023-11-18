package com.matei.backend.controller;

import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ticket-type")
public class TicketTypeController {
    private final TicketTypeService ticketTypeService;

    @PostMapping
    public ResponseEntity<?> createTicketType(@RequestBody TicketTypeCreationRequestDto ticketTypeCreationRequestDto) {
        return ResponseEntity.ok(ticketTypeService.createTicketType(ticketTypeCreationRequestDto));
    }
}
