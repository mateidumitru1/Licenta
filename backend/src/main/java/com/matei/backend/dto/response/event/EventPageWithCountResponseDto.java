package com.matei.backend.dto.response.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventPageWithCountResponseDto {
    private Page<EventWithoutTicketArtistResponseDto> eventPage;
    private Long count;
}
