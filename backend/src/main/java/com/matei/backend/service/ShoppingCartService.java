package com.matei.backend.service;

import com.matei.backend.dto.response.ShoppingCartResponseDto;
import com.matei.backend.dto.response.TicketTypeResponseDto;
import com.matei.backend.entity.ShoppingCart;
import com.matei.backend.entity.TicketType;
import com.matei.backend.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {
    private final ShoppingCartRepository shoppingCartRepository;
    private final TicketTypeService ticketTypeService;
    private final UserService userService;

    public void createShoppingCart() {

    }

    public ShoppingCartResponseDto addTicketToShoppingCart(UUID ticketTypeId, UUID userId) {
        var shoppingCart = shoppingCartRepository.findByUserId(userId).orElse(ShoppingCart.builder()
                .id(UUID.randomUUID())
                .price(0.0)
                .ticketTypeList(new ArrayList<>())
                        .user(Optional.of(userService.getUserById(userId)).map(user -> com.matei.backend.entity.User.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .role(user.getRole())
                                .build()).orElseThrow())
                .build());

        var ticketType = ticketTypeService.getTicketTypeById(ticketTypeId);

        shoppingCart.getTicketTypeList().add(Optional.of(ticketType).map(ticket -> TicketType.builder()
                .id(ticket.getId())
                .name(ticket.getName())
                .price(ticket.getPrice())
                .build()).orElseThrow());

        shoppingCart.setPrice(shoppingCart.getPrice() + ticketType.getPrice());

        var updatedShoppingCart = shoppingCartRepository.save(shoppingCart);

        return ShoppingCartResponseDto.builder()
                .id(updatedShoppingCart.getId())
                .price(updatedShoppingCart.getPrice())
                .ticketTypeList(updatedShoppingCart.getTicketTypeList().stream().map(ticket -> TicketTypeResponseDto.builder()
                        .id(ticket.getId())
                        .name(ticket.getName())
                        .price(ticket.getPrice())
                        .quantity(ticket.getQuantity())
                        .build()).toList())
                .build();
    }

    public ShoppingCartResponseDto getShoppingCart(UUID userId) {
        var shoppingCart = shoppingCartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Shopping cart not found!"));

        return getShoppingCartResponseDto(shoppingCart);
    }

    public ShoppingCartResponseDto removeTicketFromShoppingCart(UUID ticketTypeId, UUID userId) {
        var shoppingCart = shoppingCartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Shopping cart not found!"));

        var ticketType = ticketTypeService.getTicketTypeById(ticketTypeId);

        shoppingCart.getTicketTypeList().removeIf(ticket -> ticket.getId().equals(ticketTypeId));
        shoppingCart.setPrice(shoppingCart.getPrice() - ticketType.getPrice());

        shoppingCartRepository.save(shoppingCart);

        return getShoppingCartResponseDto(shoppingCart);
    }

    private ShoppingCartResponseDto getShoppingCartResponseDto(ShoppingCart shoppingCart) {
        return ShoppingCartResponseDto.builder()
                .id(shoppingCart.getId())
                .price(shoppingCart.getPrice())
                .ticketTypeList(shoppingCart.getTicketTypeList().stream().map(ticket -> TicketTypeResponseDto.builder()
                        .id(ticket.getId())
                        .name(ticket.getName())
                        .price(ticket.getPrice())
                        .quantity(ticket.getQuantity())
                        .event(Optional.of(ticket.getEvent()).map(event -> com.matei.backend.dto.response.EventResponseDto.builder()
                                .id(event.getId())
                                .title(event.getTitle())
                                .date(event.getDate())
                                .shortDescription(event.getShortDescription())
                                .description(event.getDescription())
                                .location(event.getLocation())
                                .imageUrl(event.getImageUrl())
                                .build()).orElseThrow())
                        .build()).toList())
                .build();
    }

    public void clearShoppingCart(UUID userId) {
        var shoppingCart = shoppingCartRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Shopping cart not found!"));

        shoppingCart.setPrice(0.0);
        shoppingCart.getTicketTypeList().clear();

        shoppingCartRepository.save(shoppingCart);
    }
}
