package com.matei.backend.dto.response;

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
public class ShoppingCartResponseDto {
    private UUID id;
    private Double price;
    private List<TicketTypeResponseDto> ticketTypeList;
}
