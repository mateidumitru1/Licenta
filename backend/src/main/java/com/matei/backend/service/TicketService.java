package com.matei.backend.service;

import com.google.zxing.WriterException;
import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.QRResponseDto;
import com.matei.backend.dto.response.TicketResponseDto;
import com.matei.backend.dto.response.TicketTypeResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.QR;
import com.matei.backend.entity.Ticket;
import com.matei.backend.entity.TicketType;
import com.matei.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

    public List<TicketResponseDto> createTicket(TicketCreationRequestDto ticketCreationRequestDto, int quantity, UUID userId) throws IOException, WriterException {
        List<Ticket> tickets = new ArrayList<>();
        while(quantity > 0) {
            var ticket = ticketRepository.save(Ticket.builder()
                    .ticketType(Optional.of(ticketTypeService.getTicketTypeById(ticketCreationRequestDto.getTicketTypeId()))
                            .map(ticketTypeResponseDto -> TicketType.builder()
                                    .id(ticketTypeResponseDto.getId())
                                    .name(ticketTypeResponseDto.getName())
                                    .price(ticketTypeResponseDto.getPrice())
                                    .quantity(ticketTypeResponseDto.getQuantity())
                                    .event(Optional.of(ticketTypeResponseDto.getEvent())
                                            .map(eventResponseDto -> Event.builder()
                                                    .id(eventResponseDto.getId())
                                                    .title(eventResponseDto.getTitle())
                                                    .date(eventResponseDto.getDate())
                                                    .location(eventResponseDto.getLocation())
                                                    .build()).orElseThrow())
                                    .build()).orElseThrow())
                    .qr(Optional.of(qrService.createQR())
                            .map(qrResponseDto -> QR.builder()
                                    .id(qrResponseDto.getId())
                                    .image(qrResponseDto.getImage())
                                    .used(qrResponseDto.getUsed())
                                    .build()).orElseThrow())
                    .build());
            tickets.add(ticket);
            quantity--;
        }


        emailService.sendTicketEmail(userService.getUserById(userId).getEmail(), tickets.stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> TicketTypeResponseDto.builder()
                                        .id(ticketType.getId())
                                        .name(ticketType.getName())
                                        .price(ticketType.getPrice())
                                        .quantity(ticketType.getQuantity())
                                        .event(Optional.of(ticketType.getEvent()).map(event -> EventResponseDto.builder()
                                                .id(event.getId())
                                                .title(event.getTitle())
                                                .date(event.getDate())
                                                .location(event.getLocation())
                                                .build()).orElseThrow())
                                        .build()).orElseThrow())
                        .qr(Optional.of(ticket.getQr())
                                .map(qr -> QRResponseDto.builder()
                                        .id(qr.getId())
                                        .image(qr.getImage())
                                        .build()).orElseThrow())
                        .build()).toList());

        return tickets.stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> TicketTypeResponseDto.builder()
                                        .id(ticketType.getId())
                                        .name(ticketType.getName())
                                        .price(ticketType.getPrice())
                                        .quantity(ticketType.getQuantity())
                                        .event(Optional.of(ticketType.getEvent()).map(event -> EventResponseDto.builder()
                                                .id(event.getId())
                                                .title(event.getTitle())
                                                .date(event.getDate())
                                                .location(event.getLocation())
                                                .build()).orElseThrow())
                                        .build()).orElseThrow())
                        .qr(Optional.of(ticket.getQr())
                                .map(qr -> QRResponseDto.builder()
                                        .id(qr.getId())
                                        .image(qr.getImage())
                                        .build()).orElseThrow())
                        .build()).toList();
    }

    public Boolean validateTicket(UUID qrId) {
        return qrService.validateQR(qrId);
    }
}
