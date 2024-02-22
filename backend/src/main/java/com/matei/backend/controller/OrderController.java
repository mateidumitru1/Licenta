package com.matei.backend.controller;

import com.matei.backend.exception.OrderNotFoundException;
import com.matei.backend.service.JwtService;
import com.matei.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String jwtToken){
        orderService.createOrder(jwtService.extractId(jwtToken));
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String jwtToken){
        return ResponseEntity.ok(orderService.getOrders(jwtService.extractId(jwtToken)));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable String id){
        return ResponseEntity.ok(orderService.getOrdersByUserId(UUID.fromString(id)));
    }

    @GetMapping("/{number}")
    public ResponseEntity<?> getOrderByOrderNumber(@PathVariable Long number){
        return ResponseEntity.ok(orderService.getOrderByNumber(number));
    }

    @PutMapping("/{orderNumber}/cancel")
    public ResponseEntity<?> cancelOrder(@RequestHeader("Authorization") String jwtToken, @PathVariable("orderNumber") Long orderNumber){
        orderService.cancelOrder(jwtService.extractId(jwtToken), orderNumber);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{orderNumber}/admin/cancel")
    public ResponseEntity<?> adminCancelOrder(@PathVariable("orderNumber") Long orderNumber){
        orderService.adminCancelOrder(orderNumber);
        return ResponseEntity.ok().build();
    }
}
