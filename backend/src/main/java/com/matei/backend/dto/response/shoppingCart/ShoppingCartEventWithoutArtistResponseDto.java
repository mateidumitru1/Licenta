package com.matei.backend.dto.response.shoppingCart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCartEventWithoutArtistResponseDto {
    private UUID id;
    private Double price;
    private List<ShoppingCartItemEventWithoutArtistResponseDto> shoppingCartItemList;
}
