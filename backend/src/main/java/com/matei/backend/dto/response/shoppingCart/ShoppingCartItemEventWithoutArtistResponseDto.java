package com.matei.backend.dto.response.shoppingCart;

import com.matei.backend.dto.response.ticketType.TicketTypeEventWithoutArtistResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCartItemEventWithoutArtistResponseDto {
    private UUID id;
    private TicketTypeEventWithoutArtistResponseDto ticketType;
    private Integer quantity;
}
