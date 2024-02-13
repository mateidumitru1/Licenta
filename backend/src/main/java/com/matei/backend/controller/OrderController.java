package com.matei.backend.controller;

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
        orderService.createOrder(jwtService.extractId(jwtToken.substring(7)));
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String jwtToken){
        return ResponseEntity.ok(orderService.getOrders(jwtService.extractId(jwtToken.substring(7))));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable UUID id){
        return ResponseEntity.ok(orderService.getOrdersByUserId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable UUID id){
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
}
