package com.matei.backend.controller;

import com.matei.backend.dto.response.order.OrderDetailsResponseDto;
import com.matei.backend.dto.response.order.OrderPageWithCountResponseDto;
import com.matei.backend.dto.response.order.OrderResponseDto;
import com.matei.backend.service.auth.JwtService;
import com.matei.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestHeader("Authorization") String jwtToken){
        orderService.createOrder(jwtService.extractId(jwtToken));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping
    public ResponseEntity<OrderPageWithCountResponseDto> getOrders(@RequestHeader("Authorization") String jwtToken,
                                                                   @RequestParam(value = "page", defaultValue = "0") int page,
                                                                   @RequestParam(value = "size", defaultValue = "10") int size,
                                                                   @RequestParam(value = "filter", defaultValue = "all") String filter){
        return ResponseEntity.ok(orderService.getOrders(jwtService.extractId(jwtToken), page, size, filter));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId(@PathVariable String id){
        return ResponseEntity.ok(orderService.getOrdersByUserId(UUID.fromString(id)));
    }

    @GetMapping("/{number}")
    public ResponseEntity<OrderResponseDto> getOrderByOrderNumber(@PathVariable Long number){
        return ResponseEntity.ok(orderService.getOrderByNumber(number));
    }

    @PreAuthorize("hasAuthority('USER')")
    @PutMapping("/{orderNumber}/cancel")
    public ResponseEntity<Void> cancelOrder(@RequestHeader("Authorization") String jwtToken, @PathVariable("orderNumber") Long orderNumber){
        orderService.cancelOrder(jwtService.extractId(jwtToken), orderNumber);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{orderNumber}/admin/cancel")
    public ResponseEntity<Void> adminCancelOrder(@PathVariable("orderNumber") Long orderNumber){
        orderService.adminCancelOrder(orderNumber);
        return ResponseEntity.ok().build();
    }
}
