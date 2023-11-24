package com.matei.backend.controller;

import com.matei.backend.service.JwtService;
import com.matei.backend.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shopping-cart")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;
    private final JwtService jwtService;

    @PostMapping("/{ticketTypeId}")
    public ResponseEntity<?> addTicketToShoppingCart(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketTypeId") String ticketTypeId) {

        return ResponseEntity.ok(shoppingCartService.addTicketToShoppingCart(UUID.fromString(ticketTypeId), jwtService.extractId(jwtToken.substring(7))));
    }

    @GetMapping
    public ResponseEntity<?> getShoppingCart(@RequestHeader("Authorization") String jwtToken) {

        return ResponseEntity.ok(shoppingCartService.getShoppingCart(jwtService.extractId(jwtToken.substring(7))));
    }

    @PutMapping("/{ticketTypeId}")
    public ResponseEntity<?> removeTicketFromShoppingCart(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketTypeId") String ticketTypeId) {

        return ResponseEntity.ok(shoppingCartService.removeTicketFromShoppingCart(UUID.fromString(ticketTypeId), jwtService.extractId(jwtToken.substring(7))));
    }
}
