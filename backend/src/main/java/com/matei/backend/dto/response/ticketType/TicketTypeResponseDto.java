package com.matei.backend.dto.response.ticketType;

import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketTypeResponseDto {
    private UUID id;
    private String name;
    private Double price;
    private Integer totalQuantity;
    private Integer remainingQuantity;
    private EventWithoutTicketArtistResponseDto event;
}
