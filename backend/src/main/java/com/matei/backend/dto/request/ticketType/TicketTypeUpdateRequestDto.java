package com.matei.backend.dto.request.ticketType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketTypeUpdateRequestDto {
    private UUID id;
    private String name;
    private Double price;
    private Integer quantity;
}
