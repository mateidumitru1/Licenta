package com.matei.backend.service;

import com.google.zxing.WriterException;
import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.OrderResponseDto;
import com.matei.backend.entity.*;
import com.matei.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ShoppingCartService shoppingCartService;
    private final TicketService ticketService;

    public void createOrder(UUID userId) {
        var shoppingCart = shoppingCartService.getShoppingCart(userId);

        orderRepository.save(Order.builder()
                .id(UUID.randomUUID())
                .price(shoppingCart.getPrice())
                .date(LocalDateTime.now())
                .user(Optional.of(userService.getUserById(userId)).map(user -> User.builder()
                        .id(user.getId()).build()).orElseThrow())
                .ticketList(shoppingCart.getShoppingCartItemList().stream()
                        .map(shoppingCartItem -> {
                            try {
                                var ticketDtoList = ticketService.createTicket(TicketCreationRequestDto.builder()
                                        .ticketTypeId(shoppingCartItem.getTicketType().getId()).build(), shoppingCartItem.getQuantity(), userId);
                                return ticketDtoList.stream().map(ticketResponseDto -> Ticket.builder()
                                        .id(ticketResponseDto.getId())
                                        .ticketType(Optional.of(ticketResponseDto.getTicketType())
                                                .map(ticketTypeResponseDto -> TicketType.builder()
                                                        .id(ticketTypeResponseDto.getId())
                                                        .name(ticketTypeResponseDto.getName())
                                                        .price(ticketTypeResponseDto.getPrice())
                                                        .quantity(ticketTypeResponseDto.getQuantity())
                                                        .event(Optional.of(ticketTypeResponseDto.getEvent())
                                                                .map(eventResponseDto -> Event.builder()
                                                                        .id(eventResponseDto.getId())
                                                                        .title(eventResponseDto.getTitle())
                                                                        .date(eventResponseDto.getDate())
                                                                        .location(eventResponseDto.getLocation())
                                                                        .build()).orElseThrow())
                                                        .build()).orElseThrow())
                                        .qr(Optional.of(ticketResponseDto.getQr())
                                                .map(qrResponseDto -> QR.builder()
                                                        .id(qrResponseDto.getId())
                                                        .image(qrResponseDto.getImage())
                                                        .used(qrResponseDto.getUsed())
                                                        .build()).orElseThrow())
                                        .build()).toList();
                            } catch (IOException | WriterException e) {
                                throw new RuntimeException(e);
                            }
                        }).flatMap(java.util.List::stream).toList())
                .build());
        shoppingCartService.clearShoppingCart(userId);
    }
}
