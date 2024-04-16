package com.matei.backend.dto.response.location;

import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationWithEventPageResponseDto {
    private UUID id;
    private String name;
    private String address;
    private String imageUrl;
    private Double longitude;
    private Double latitude;
    private Page<EventWithoutTicketArtistResponseDto> eventPage;
}
