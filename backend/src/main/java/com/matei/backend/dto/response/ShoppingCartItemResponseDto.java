package com.matei.backend.dto.response;

import com.matei.backend.entity.ShoppingCart;
import com.matei.backend.entity.TicketType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
