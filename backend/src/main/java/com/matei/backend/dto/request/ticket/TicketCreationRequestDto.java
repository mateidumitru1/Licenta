package com.matei.backend.dto.request.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketCreationRequestDto {
    private UUID ticketTypeId;
    private Integer quantity;
}
