package com.matei.backend.dto.response.shoppingCart;

import com.matei.backend.dto.response.ticketType.TicketTypeResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeWithoutEventResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCartItemResponseDto {
    private UUID id;
    private TicketTypeResponseDto ticketType;
    private Integer quantity;
}
