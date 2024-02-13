package com.matei.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponseDto {
    private UUID id;
    private Double price;
    private LocalDateTime date;
    private List<TicketResponseDto> ticketList;
    private UserResponseDto user;
}
