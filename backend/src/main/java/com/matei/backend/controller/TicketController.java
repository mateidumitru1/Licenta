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
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;
    private final JwtService jwtService;

    @GetMapping("/validate/{qrId}")
    public ResponseEntity<?> validateTicket(@PathVariable("qrId") String qrId) {

        return ResponseEntity.ok(ticketService.validateTicket(UUID.fromString(qrId)));
    }

    @GetMapping
    public ResponseEntity<?> getTickets(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(ticketService.getTickets(jwtService.extractId(jwtToken.substring(7))));
    }

    @PutMapping("/{ticketId}/cancel")
    public ResponseEntity<?> cancelTicket(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketId") String ticketId) {
        ticketService.cancelTicket(jwtService.extractId(jwtToken.substring(7)), UUID.fromString(ticketId));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{ticketId}/admin/cancel")
    public ResponseEntity<?> adminCancelTicket(@PathVariable("ticketId") String ticketId) {
        ticketService.adminCancelTicket(UUID.fromString(ticketId));
        return ResponseEntity.ok().build();
    }
}
