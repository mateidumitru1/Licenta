package com.matei.backend.service;

import com.google.zxing.WriterException;
import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.QRResponseDto;
import com.matei.backend.dto.response.TicketResponseDto;
import com.matei.backend.dto.response.TicketTypeResponseDto;
import com.matei.backend.entity.QR;
import com.matei.backend.entity.Ticket;
import com.matei.backend.entity.TicketType;
import com.matei.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketTypeService ticketTypeService;
    private final QRService qrService;
    private final EmailService emailService;
    private final UserService userService;

    public TicketResponseDto createTicket(TicketCreationRequestDto ticketCreationRequestDto, UUID userId) throws IOException, WriterException {
        var ticket = ticketRepository.save(Ticket.builder()
                .ticketType(Optional.of(ticketTypeService.getTicketTypeById(ticketCreationRequestDto.getTicketTypeId()))
                        .map(ticketTypeResponseDto -> TicketType.builder()
                                .id(ticketTypeResponseDto.getId())
                                .name(ticketTypeResponseDto.getName())
                                .price(ticketTypeResponseDto.getPrice())
                                .quantity(ticketTypeResponseDto.getQuantity())
                                .build()).orElseThrow())
                        .qr(Optional.of(qrService.generateQR())
                                .map(qrResponseDto -> QR.builder()
                                        .id(qrResponseDto.getId())
                                        .image(qrResponseDto.getImage())
                                        .used(qrResponseDto.getUsed())
                                        .build()).orElseThrow())
                .build());

        emailService.sendTicketEmail(userService.getUserById(userId).getEmail(), Optional.of(ticket)
                .map(ticket1 -> TicketResponseDto.builder()
                        .id(ticket1.getId())
                        .ticketType(Optional.of(ticket1.getTicketType())
                                .map(ticketType -> TicketTypeResponseDto.builder()
                                        .id(ticketType.getId())
                                        .name(ticketType.getName())
                                        .price(ticketType.getPrice())
                                        .quantity(ticketType.getQuantity())
                                        .build()).orElseThrow())
                        .qr(Optional.of(ticket1.getQr())
                                .map(qr -> QRResponseDto.builder()
                                        .id(qr.getId())
                                        .image(qr.getImage())
                                        .build()).orElseThrow())
                        .build()).orElseThrow());

        return TicketResponseDto.builder()
                .id(ticket.getId())
                .ticketType(Optional.of(ticket.getTicketType())
                        .map(ticketType -> TicketTypeResponseDto.builder()
                                .id(ticketType.getId())
                                .name(ticketType.getName())
                                .price(ticketType.getPrice())
                                .quantity(ticketType.getQuantity())
                                .build()).orElseThrow())
                .qr(Optional.of(ticket.getQr())
                        .map(qr -> QRResponseDto.builder()
                                .id(qr.getId())
                                .image(qr.getImage())
                                .build()).orElseThrow())
                .build();
    }

    public Boolean validateTicket(UUID qrId) {
        return qrService.validateQR(qrId);
    }
}
