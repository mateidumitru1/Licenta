package com.matei.backend.controller;

import com.matei.backend.service.JwtService;
import com.matei.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {
    private final OrderService orderService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String jwtToken){
        orderService.createOrder(jwtService.extractId(jwtToken.substring(7)));
        return ResponseEntity.ok().build();
    }
}
