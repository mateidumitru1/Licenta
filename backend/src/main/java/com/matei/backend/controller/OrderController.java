package com.matei.backend.controller;

import com.matei.backend.exception.OrderNotFoundException;
import com.matei.backend.exception.QRCreationException;
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
        try {
            orderService.createOrder(jwtService.extractId(jwtToken.substring(7)));
            return ResponseEntity.ok().build();
        }
        catch (QRCreationException e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String jwtToken){
        return ResponseEntity.ok(orderService.getOrders(jwtService.extractId(jwtToken.substring(7))));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable String id){
        try {
            return ResponseEntity.ok(orderService.getOrdersByUserId(UUID.fromString(id)));
        }
        catch(OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{number}")
    public ResponseEntity<?> getOrderByOrderNumber(@PathVariable Long number){
        try {
            return ResponseEntity.ok(orderService.getOrderByNumber(number));
        }
        catch(OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{orderNumber}/cancel")
    public ResponseEntity<?> cancelOrder(@RequestHeader("Authorization") String jwtToken, @PathVariable("orderNumber") Long orderNumber){
        try {
            orderService.cancelOrder(jwtService.extractId(jwtToken.substring(7)), orderNumber);
            return ResponseEntity.ok().build();
        }
        catch(OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{orderNumber}/admin/cancel")
    public ResponseEntity<?> adminCancelOrder(@PathVariable("orderNumber") Long orderNumber){
        try {
            orderService.adminCancelOrder(orderNumber);
            return ResponseEntity.ok().build();
        }
        catch(OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
