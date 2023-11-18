package com.matei.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketTypeCreationRequestDto {
    private String name;
    private Double price;
    private Integer quantity;
    private String eventId;
}
