package com.matei.backend.dto.response;

import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.entity.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventWithTicketTypesResponseDto {
    private UUID id;
    private String title;
    private LocalDate date;
    private String shortDescription;
    private String description;
    private LocationResponseDto location;
    private String imageUrl;
    private List<TicketTypeResponseDto> ticketTypes;
}
