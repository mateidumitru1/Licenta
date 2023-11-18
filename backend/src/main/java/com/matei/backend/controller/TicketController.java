package com.matei.backend.controller;

import com.google.zxing.WriterException;
import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.service.JwtService;
import com.matei.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ticket")
public class TicketController {
    private final TicketService ticketService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketCreationRequestDto ticketCreationRequestDto,
                                          @RequestHeader("Authorization") String jwtToken) throws IOException, WriterException {

        return ResponseEntity.ok(ticketService.createTicket(ticketCreationRequestDto, jwtService.extractId(jwtToken)));
    }
}
