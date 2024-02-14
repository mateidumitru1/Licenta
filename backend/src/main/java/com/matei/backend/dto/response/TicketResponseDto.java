package com.matei.backend.dto.response;

import com.matei.backend.entity.QR;
import com.matei.backend.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TicketResponseDto {
    private UUID id;
    private TicketTypeResponseDto ticketType;
    private Status status;
    private QRResponseDto qr;
}
