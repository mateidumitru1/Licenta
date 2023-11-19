package com.matei.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketTypeUpdateRequestDto {
    private String id;
    private String name;
    private String price;
    private String quantity;
}
