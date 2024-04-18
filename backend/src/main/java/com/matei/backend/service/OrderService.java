package com.matei.backend.service;

import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.order.OrderResponseDto;
import com.matei.backend.dto.response.shoppingCart.ShoppingCartItemEventWithoutArtistResponseDto;
import com.matei.backend.dto.response.ticket.TicketResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeEventWithoutArtistResponseDto;
import com.matei.backend.dto.response.user.UserResponseDto;
import com.matei.backend.entity.*;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.entity.enums.Status;
import com.matei.backend.exception.event.EventPastException;
import com.matei.backend.exception.order.OrderNotFoundException;
import com.matei.backend.exception.shoppingCart.ShoppingCartItemNotFoundException;
import com.matei.backend.exception.ticketType.TicketTypeQuantityException;
import com.matei.backend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ShoppingCartService shoppingCartService;
    private final TicketService ticketService;
    private final UserGenrePreferenceService userGenrePreferenceService;
    private final ModelMapper modelMapper;

    public void createOrder(UUID userId) {
        var shoppingCart = shoppingCartService.getShoppingCartDto(userId);

        if(shoppingCart.getShoppingCartItemList().isEmpty()) {
            throw new ShoppingCartItemNotFoundException("Shopping cart is empty");
        }

        shoppingCart.getShoppingCartItemList().forEach(shoppingCartItem -> {
            if (shoppingCartItem.getTicketType().getEvent().getDate().isBefore(LocalDate.now())) {
                throw new EventPastException("Event is in the past");
            }
            if(shoppingCartItem.getTicketType().getRemainingQuantity() < shoppingCartItem.getQuantity()) {
                throw new TicketTypeQuantityException("Not enough tickets available");
            }
        });

        var order = orderRepository.save(Order.builder()
                .id(UUID.randomUUID())
                .price(shoppingCart.getPrice())
                .createdAt(LocalDateTime.now())
                .status(Status.CONFIRMED)
                .user(Optional.of(userService.getUserById(userId)).map(user -> User.builder()
                        .id(user.getId()).build()).orElseThrow())
                .build());

        Map<EventWithoutTicketArtistResponseDto, List<ShoppingCartItemEventWithoutArtistResponseDto>> eventShoppingCartMap = shoppingCart.getShoppingCartItemList().stream()
                .collect(Collectors.groupingBy(shoppingCartItem ->
                        shoppingCartItem.getTicketType().getEvent(), Collectors.toList()));

        ticketService.createTickets(eventShoppingCartMap, userId, getCreationOrderResponseDto(order));
        shoppingCartService.clearShoppingCart(userId);

        userGenrePreferenceService.updateUserGenrePreferences(userId, shoppingCart.getShoppingCartItemList().stream()
                .map(shoppingCartItemResponseDto -> shoppingCartItemResponseDto.getTicketType().getEvent()).collect(Collectors.toSet()));
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
                .createdAt(order.getCreatedAt())
                .status(order.getStatus())
                .ticketList(order.getTicketList().stream().map(ticket -> {
                    TicketResponseDto.TicketResponseDtoBuilder ticketResponseDtoBuilder = TicketResponseDto.builder()
                            .id(ticket.getId())
                            .status(ticket.getStatus())
                            .image(ticket.getImage())
                            .scanned(ticket.getScanned());

                    TicketTypeEventWithoutArtistResponseDto ticketTypeEventWithoutArtistResponseDto = null;
                    if (ticket.getTicketType() != null) {
                        ticketTypeEventWithoutArtistResponseDto = TicketTypeEventWithoutArtistResponseDto.builder()
                                .id(ticket.getTicketType().getId())
                                .name(ticket.getTicketType().getName())
                                .price(ticket.getTicketType().getPrice())
                                .totalQuantity(ticket.getTicketType().getTotalQuantity())
                                .remainingQuantity(ticket.getTicketType().getRemainingQuantity())
                                .build();

                        EventWithoutTicketArtistResponseDto eventResponseDto = null;
                        if (ticket.getTicketType().getEvent() != null) {
                            eventResponseDto = EventWithoutTicketArtistResponseDto.builder()
                                    .id(ticket.getTicketType().getEvent().getId())
                                    .title(ticket.getTicketType().getEvent().getTitle())
                                    .date(ticket.getTicketType().getEvent().getDate())
                                    .location(modelMapper.map(ticket.getTicketType().getEvent().getLocation(), LocationWithoutEventListResponseDto.class))
                                    .build();
                        }
                        ticketTypeEventWithoutArtistResponseDto.setEvent(eventResponseDto);
                    }

                    ticketResponseDtoBuilder.ticketType(ticketTypeEventWithoutArtistResponseDto);
                    return ticketResponseDtoBuilder.build();
                }).collect(Collectors.toList()))
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
                .createdAt(order.getCreatedAt())
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
        if(order.getCreatedAt().isBefore(LocalDateTime.now())) {
            throw new EventPastException("Event has already passed");
        }
        order.setStatus(Status.CANCELED);
        order.getTicketList().forEach(ticket -> ticketService.adminCancelTicket(ticket.getId()));
        orderRepository.save(order);
    }

    public Long getTotalNumberOfConfirmedOrders(StatisticsFilter filter) {
        if(filter.equals(StatisticsFilter.ALL)) {
            return orderRepository.countByStatusConfirmed();
        }
        return orderRepository.countByCreatedAtAfterAndStatusConfirmed(filter.getStartDate());
    }

    public Double getTotalRevenue(StatisticsFilter filter) {
        if(filter.equals(StatisticsFilter.ALL)) {
            return orderRepository.sumPriceByStatusConfirmed();
        }
        return orderRepository.sumPriceByCreatedAtAfterAndStatusConfirmed(filter.getStartDate());
    }
}
