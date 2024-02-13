package com.matei.backend.service;

import com.matei.backend.dto.request.ShoppingCartItemRequestDto;
import com.matei.backend.dto.response.*;
import com.matei.backend.entity.*;
import com.matei.backend.repository.ShoppingCartItemRepository;
import com.matei.backend.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {
    private final ShoppingCartRepository shoppingCartRepository;
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final TicketTypeService ticketTypeService;
    private final UserService userService;

    public ShoppingCart createEmptyShoppingCart(UUID userId) {
        return shoppingCartRepository.save(ShoppingCart.builder()
                .id(UUID.randomUUID())
                .price(0.0)
                .shoppingCartItemList(new ArrayList<>())
                .user(User.builder().id(userId).build())
                .build());
    }

    public ShoppingCartResponseDto addTicketToShoppingCart(List<ShoppingCartItemRequestDto> shoppingCartItemRequestDtoList, UUID userId) {
        var shoppingCart = findShoppingCartOrElseEmpty(userId);

        var newPrice = shoppingCart.getPrice();

        for (ShoppingCartItemRequestDto shoppingCartItemRequestDto : shoppingCartItemRequestDtoList) {
            var ticketType = ticketTypeService.getTicketTypeById(shoppingCartItemRequestDto.getTicketTypeId());

            newPrice += ticketType.getPrice() * shoppingCartItemRequestDto.getQuantity();

            var existingItem = shoppingCart.getShoppingCartItemList().stream()
                    .filter(item -> item.getTicketType().getId().equals(ticketType.getId()))
                    .findFirst();

            if (existingItem.isEmpty()) {
                var shoppingCartItem = ShoppingCartItem.builder()
                        .quantity(shoppingCartItemRequestDto.getQuantity())
                        .ticketType(TicketType.builder().
                                id(ticketType.getId())
                                .name(ticketType.getName())
                                .price(ticketType.getPrice())
                                .quantity(ticketType.getQuantity())
                                .event(Event.builder()
                                        .id(ticketType.getEvent().getId())
                                        .title(ticketType.getEvent().getTitle())
                                        .date(ticketType.getEvent().getDate())
                                        .shortDescription(ticketType.getEvent().getShortDescription())
                                        .description(ticketType.getEvent().getDescription())
                                        .location(ticketType.getEvent().getLocation())
                                        .imageUrl(ticketType.getEvent().getImageUrl())
                                        .build())
                                .build())
                        .shoppingCart(shoppingCart)
                        .build();

                shoppingCart.getShoppingCartItemList().add(shoppingCartItemRepository.save(shoppingCartItem));
            } else {
                existingItem.ifPresent(item -> {
                    item.setQuantity(item.getQuantity() + shoppingCartItemRequestDto.getQuantity());
                    shoppingCartItemRepository.save(item);
                });
            }
        }

        shoppingCart.setPrice(newPrice);

        var updatedShoppingCart = shoppingCartRepository.save(shoppingCart);

        return getShoppingCartResponseDto(updatedShoppingCart);
    }

    public ShoppingCartResponseDto getShoppingCart(UUID userId) {
        var shoppingCart = findShoppingCartOrElseEmpty(userId);

        return getShoppingCartResponseDto(shoppingCart);
    }

    private ShoppingCart findShoppingCartOrElseEmpty(UUID userId) {
        return shoppingCartRepository.findByUserId(userId).orElseGet(() -> {
            var user = userService.getUserById(userId);
            return createEmptyShoppingCart(user.getId());
        });
    }

    public ShoppingCartResponseDto removeTicketFromShoppingCart(UUID ticketTypeId, UUID userId) {
        var shoppingCart = findShoppingCartOrElseEmpty(userId);

        var ticketType = ticketTypeService.getTicketTypeById(ticketTypeId);
        var newPrice = shoppingCart.getPrice() - ticketType.getPrice() *
                shoppingCart.getShoppingCartItemList().stream()
                        .filter(shoppingCartItem -> shoppingCartItem.getTicketType().getId().equals(ticketTypeId))
                        .findFirst().orElseThrow()
                        .getQuantity();

        shoppingCartItemRepository.delete(shoppingCart.getShoppingCartItemList().stream()
                .filter(shoppingCartItem -> shoppingCartItem.getTicketType().getId().equals(ticketTypeId))
                .findFirst().orElseThrow());

        shoppingCart.getShoppingCartItemList().removeIf(shoppingCartItem -> shoppingCartItem.getTicketType().getId().equals(ticketTypeId));

        shoppingCart.setPrice((double) Math.round(newPrice * 100) / 100);

        shoppingCartRepository.save(shoppingCart);

        return getShoppingCartResponseDto(shoppingCart);
    }

    public ShoppingCartResponseDto updateTicketQuantity(UUID shoppingCartItemId, Integer quantity, UUID userId) {
        var shoppingCart = findShoppingCartOrElseEmpty(userId);

        var shoppingCartItem = shoppingCart.getShoppingCartItemList().stream()
                .filter(item -> item.getId().equals(shoppingCartItemId))
                .findFirst().orElseThrow();

        var priceToAdd = (quantity - shoppingCartItem.getQuantity()) * shoppingCartItem.getTicketType().getPrice();

        shoppingCart.setPrice(shoppingCart.getPrice() + priceToAdd);
        shoppingCartItem.setQuantity(quantity);

        shoppingCartItemRepository.save(shoppingCartItem);
        shoppingCartRepository.save(shoppingCart);

        return getShoppingCartResponseDto(shoppingCart);
    }

    private ShoppingCartResponseDto getShoppingCartResponseDto(ShoppingCart shoppingCart) {
        return ShoppingCartResponseDto.builder()
                .id(shoppingCart.getId())
                .price(shoppingCart.getPrice())
                .shoppingCartItemList(shoppingCart.getShoppingCartItemList().stream().map(shoppingCartItem -> ShoppingCartItemResponseDto.builder()
                        .id(shoppingCartItem.getId())
                        .quantity(shoppingCartItem.getQuantity())
                        .ticketType(TicketTypeResponseDto.builder()
                                .id(shoppingCartItem.getTicketType().getId())
                                .name(shoppingCartItem.getTicketType().getName())
                                .price(shoppingCartItem.getTicketType().getPrice())
                                .quantity(shoppingCartItem.getTicketType().getQuantity())
                                .event(EventResponseDto.builder()
                                        .id(shoppingCartItem.getTicketType().getEvent().getId())
                                        .title(shoppingCartItem.getTicketType().getEvent().getTitle())
                                        .description(shoppingCartItem.getTicketType().getEvent().getDescription())
                                        .date(shoppingCartItem.getTicketType().getEvent().getDate())
                                        .location(shoppingCartItem.getTicketType().getEvent().getLocation())
                                        .build())
                                .build())
                        .build()).toList())
                .build();
    }

    public void clearShoppingCart(UUID userId) {
        var shoppingCart = findShoppingCartOrElseEmpty(userId);

        shoppingCart.setPrice(0.0);

        shoppingCartItemRepository.deleteAll(shoppingCart.getShoppingCartItemList());
        shoppingCart.getShoppingCartItemList().clear();

        shoppingCartRepository.save(shoppingCart);
    }
}
