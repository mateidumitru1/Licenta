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
            orderService.createOrder(jwtService.extractId(jwtToken));
            return ResponseEntity.ok().build();
        }
        catch (QRCreationException e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestHeader("Authorization") String jwtToken){
        return ResponseEntity.ok(orderService.getOrders(jwtService.extractId(jwtToken)));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable String id){
        try {
            return ResponseEntity.ok(orderService.getOrdersByUserId(UUID.fromString(id)));
        }
        catch(OrderNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
        catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid UUID");
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
        orderService.cancelOrder(jwtService.extractId(jwtToken), orderNumber);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{orderNumber}/admin/cancel")
    public ResponseEntity<?> adminCancelOrder(@PathVariable("orderNumber") Long orderNumber){
        orderService.adminCancelOrder(orderNumber);
        return ResponseEntity.ok().build();
    }
}
