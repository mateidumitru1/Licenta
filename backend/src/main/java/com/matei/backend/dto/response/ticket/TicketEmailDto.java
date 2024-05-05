package com.matei.backend.dto.response.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketEmailDto {
    private String ticketType;
    private String image;
    private String price;
}
