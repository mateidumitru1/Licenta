package com.matei.backend.dto.response.ticket;

import com.matei.backend.dto.response.ticketType.TicketTypeEventWithoutArtistResponseDto;
import com.matei.backend.entity.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketResponseDto {
    private UUID id;
    private TicketTypeEventWithoutArtistResponseDto ticketType;
    private Status status;
    private String image;
    private Boolean scanned;
    private Boolean alreadyScanned;
    private LocalDateTime scannedAt;
    private String username;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
}
