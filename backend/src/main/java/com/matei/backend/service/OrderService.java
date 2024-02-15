package com.matei.backend.service;

import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.*;
import com.matei.backend.entity.*;
import com.matei.backend.exception.OrderNotFoundException;
import com.matei.backend.exception.QRCreationException;
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

    public void createOrder(UUID userId) throws QRCreationException {
        var shoppingCart = shoppingCartService.getShoppingCart(userId);

        var order = orderRepository.save(Order.builder()
                .id(UUID.randomUUID())
                .price(shoppingCart.getPrice())
                .date(LocalDateTime.now())
                .status(Status.CONFIRMED)
                .user(Optional.of(userService.getUserById(userId)).map(user -> User.builder()
                        .id(user.getId()).build()).orElseThrow())
                .build());

        var ticketList = shoppingCart.getShoppingCartItemList().stream().map(shoppingCartItem ->
                ticketService.createTicket(TicketCreationRequestDto.builder()
                    .ticketTypeId(shoppingCartItem.getTicketType().getId()).build(), shoppingCartItem.getQuantity(), userId,
                        getCreationOrderResponseDto(order)))
                .toList().stream().flatMap(List::stream).toList();

        shoppingCartService.clearShoppingCart(userId);
    }

    public List<OrderResponseDto> getOrders(UUID id) {
        var orderList = orderRepository.findAllByUserId(id).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        return orderList.stream().map(this::getOrderResponseDto).toList();
    }

    public List<OrderResponseDto> getOrdersByUserId(UUID userId) {
        var orderList = orderRepository.findAllByUserId(userId).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        return orderList.stream().map(this::getOrderResponseDto).toList();
    }

    public OrderResponseDto getOrderByNumber(Long number) {
        return orderRepository.findByOrderNumber(number).map(this::getOrderResponseDto).orElseThrow(() -> new OrderNotFoundException("Order not found"));
    }

    public OrderResponseDto getOrderResponseDto(Order order) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .price(order.getPrice())
                .date(order.getDate())
                .status(order.getStatus())
                .ticketList(order.getTicketList().stream().map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType()).map(ticketType -> TicketTypeResponseDto.builder()
                                .id(ticketType.getId())
                                .name(ticketType.getName())
                                .price(ticketType.getPrice())
                                .event(EventResponseDto.builder()
                                        .id(ticketType.getEvent().getId())
                                        .title(ticketType.getEvent().getTitle())
                                        .date(ticketType.getEvent().getDate())
                                        .location(ticketType.getEvent().getLocation())
                                        .build())
                                .build()).orElseThrow())
                        .qr(Optional.of(ticket.getQr()).map(qr -> QRResponseDto.builder()
                                .id(qr.getId())
                                .used(qr.getUsed())
                                .image(qr.getImage())
                                .build()).orElseThrow())
                        .build()).toList())
                .user(UserResponseDto.builder()
                        .id(order.getUser().getId())
                        .email(order.getUser().getEmail())
                        .firstName(order.getUser().getFirstName())
                        .lastName(order.getUser().getLastName())
                        .build())
                .build();
    }

    public OrderResponseDto getCreationOrderResponseDto(Order order) {
        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .price(order.getPrice())
                .date(order.getDate())
                .status(order.getStatus())
                .user(UserResponseDto.builder()
                        .id(order.getUser().getId())
                        .email(order.getUser().getEmail())
                        .firstName(order.getUser().getFirstName())
                        .lastName(order.getUser().getLastName())
                        .build())
                .build();
    }

    public void cancelOrder(UUID userId, Long orderNumber) {
        var order = orderRepository.findByOrderNumber(orderNumber).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        if (order.getUser().getId().equals(userId)) {
            order.setStatus(Status.CANCELED);
            order.getTicketList().forEach(ticket -> ticketService.cancelTicket(userId, ticket.getId()));
            orderRepository.save(order);
        }
    }

    public void adminCancelOrder(Long orderNumber) {
        var order = orderRepository.findByOrderNumber(orderNumber).orElseThrow(() -> new OrderNotFoundException("Order not found"));
        order.setStatus(Status.CANCELED);
        order.getTicketList().forEach(ticket -> ticketService.adminCancelTicket(ticket.getId()));
        orderRepository.save(order);
    }
}
