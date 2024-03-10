package com.matei.backend.dto.request.shoppingCart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCartItemRequestDto {
    private Integer quantity;
    private UUID ticketTypeId;
}
