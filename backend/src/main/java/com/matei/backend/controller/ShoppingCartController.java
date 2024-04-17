package com.matei.backend.controller;

import com.matei.backend.dto.request.shoppingCart.ShoppingCartItemRequestDto;
import com.matei.backend.dto.response.shoppingCart.ShoppingCartEventWithoutArtistResponseDto;
import com.matei.backend.dto.response.shoppingCart.ShoppingCartResponseDto;
import com.matei.backend.service.auth.JwtService;
import com.matei.backend.service.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shopping-cart")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCartService;
    private final JwtService jwtService;

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<ShoppingCartEventWithoutArtistResponseDto> addTicketToShoppingCart(@RequestHeader("Authorization") String jwtToken, @RequestBody List<ShoppingCartItemRequestDto> shoppingCartItemRequestDtoList) {
        return ResponseEntity.ok(shoppingCartService.addTicketToShoppingCart(shoppingCartItemRequestDtoList,  jwtService.extractId(jwtToken)));
    }

    @PreAuthorize("hasAuthority('USER')")
    @PatchMapping("/{shoppingCartItemId}")
    public ResponseEntity<ShoppingCartEventWithoutArtistResponseDto> updateTicketQuantity(@RequestHeader("Authorization") String jwtToken, @PathVariable("shoppingCartItemId") String shoppingCartItemId,
                                                  @RequestParam("quantity") Integer quantity) {
        return ResponseEntity.ok(shoppingCartService.updateTicketQuantity(UUID.fromString(shoppingCartItemId), quantity, jwtService.extractId(jwtToken)));
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping
    public ResponseEntity<ShoppingCartEventWithoutArtistResponseDto> getShoppingCart(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(shoppingCartService.getShoppingCartEventWithoutArtistDto(jwtService.extractId(jwtToken)));
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/size")
    public ResponseEntity<Integer> getShoppingCartSize(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(shoppingCartService.getShoppingCartSize(jwtService.extractId(jwtToken)));
    }

    @PreAuthorize("hasAuthority('USER')")
    @PutMapping("/{ticketTypeId}")
    public ResponseEntity<?> removeTicketFromShoppingCart(@RequestHeader("Authorization") String jwtToken, @PathVariable("ticketTypeId") String ticketTypeId) {
        return ResponseEntity.ok(shoppingCartService.removeTicketFromShoppingCart(UUID.fromString(ticketTypeId), jwtService.extractId(jwtToken)));
    }
}
