package com.matei.backend.controller;

import com.matei.backend.dto.request.shoppingCart.ShoppingCartItemRequestDto;
import com.matei.backend.service.auth.JwtService;
import com.matei.backend.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shopping-cart")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> addTicketToShoppingCart(@RequestHeader("Authorization") String jwtToken, @RequestBody List<ShoppingCartItemRequestDto> shoppingCartItemRequestDtoList) {
        return ResponseEntity.ok(shoppingCartService.addTicketToShoppingCart(shoppingCartItemRequestDtoList,  jwtService.extractId(jwtToken)));
    }

    @PatchMapping("/{shoppingCartItemId}")
    public ResponseEntity<?> updateTicketQuantity(@RequestHeader("Authorization") String jwtToken, @PathVariable("shoppingCartItemId") String shoppingCartItemId,
                                                  @RequestParam("quantity") Integer quantity) {
        return ResponseEntity.ok(shoppingCartService.updateTicketQuantity(UUID.fromString(shoppingCartItemId), quantity, jwtService.extractId(jwtToken)));
    }

    @GetMapping
    public ResponseEntity<?> getShoppingCart(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(shoppingCartService.getShoppingCart(jwtService.extractId(jwtToken)));
    }

    @PutMapping("/{ticketTypeId}")
    public ResponseEntity<?> removeTicketFromShoppingCart(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketTypeId") String ticketTypeId) {
        return ResponseEntity.ok(shoppingCartService.removeTicketFromShoppingCart(UUID.fromString(ticketTypeId), jwtService.extractId(jwtToken)));
    }
}
