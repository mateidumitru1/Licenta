package com.matei.backend.controller;

import com.matei.backend.service.auth.JwtService;
import com.matei.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;
    private final JwtService jwtService;

    @GetMapping("/validate/{ticketId}")
    public ResponseEntity<?> validateTicket(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketId") String qrId) {
        return ResponseEntity.ok(ticketService.validateTicket(jwtService.extractId(jwtToken), UUID.fromString(qrId)));
    }

    @GetMapping
    public ResponseEntity<?> getTickets(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(ticketService.getTickets(jwtService.extractId(jwtToken)));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<?> getTicketsForEvent(@RequestHeader("Authorization") String jwtToken, @PathVariable("eventId") String eventId) {
        return ResponseEntity.ok(ticketService.getTicketsForEvent(jwtService.extractId(jwtToken), UUID.fromString(eventId)));
    }

    @PutMapping("/{ticketId}/cancel")
    public ResponseEntity<?> cancelTicket(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketId") String ticketId) {
        ticketService.cancelTicket(jwtService.extractId(jwtToken), UUID.fromString(ticketId));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{ticketId}/admin/cancel")
    public ResponseEntity<?> adminCancelTicket(@PathVariable("ticketId") String ticketId) {
        ticketService.adminCancelTicket(UUID.fromString(ticketId));
        return ResponseEntity.ok().build();
    }
}
