package com.matei.backend.service;

import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.OrderResponseDto;
import com.matei.backend.entity.*;
import com.matei.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ShoppingCartService shoppingCartService;
    private final TicketService ticketService;
    private final ModelMapper modelMapper;

    public void createOrder(UUID userId) {
        var shoppingCart = shoppingCartService.getShoppingCart(userId);

        var order = orderRepository.save(Order.builder()
                .id(UUID.randomUUID())
                .price(shoppingCart.getPrice())
                .date(LocalDateTime.now())
                .user(Optional.of(userService.getUserById(userId)).map(user -> User.builder()
                        .id(user.getId()).build()).orElseThrow())
                .build());

        var ticketList = shoppingCart.getShoppingCartItemList().stream().map(shoppingCartItem ->
                ticketService.createTicket(TicketCreationRequestDto.builder()
                    .ticketTypeId(shoppingCartItem.getTicketType().getId()).build(), shoppingCartItem.getQuantity(), userId,
                        modelMapper.map(order, OrderResponseDto.class)))
                .toList().stream().flatMap(List::stream).toList();

        shoppingCartService.clearShoppingCart(userId);
    }
}
