package com.matei.backend.dto.response.event;

import com.matei.backend.dto.response.broadGenre.BroadGenreResponseDto;
import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import com.matei.backend.dto.response.ticket.TicketEmailDto;
import com.matei.backend.dto.response.ticket.TicketResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeWithoutEventResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventEmailDto {
    private String title;
    private String date;
    private String locationName;
    private String broadGenreName;
    private List<TicketEmailDto> ticketList;
}
