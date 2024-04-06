package com.matei.backend.dto.response.location;

import com.matei.backend.dto.response.event.EventWithoutLocationTicketResponseDto;
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
public class LocationResponseDto {
    private UUID id;
    private String name;
    private String address;
    private String imageUrl;
    private List<EventWithoutLocationTicketResponseDto> eventList;
}
