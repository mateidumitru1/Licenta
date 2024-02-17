package com.matei.backend.service;

import com.google.zxing.WriterException;
import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.*;
import com.matei.backend.entity.*;
import com.matei.backend.entity.enums.Status;
import com.matei.backend.exception.QRCreationException;
import com.matei.backend.exception.TicketNotFoundException;
import com.matei.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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
    private final ModelMapper modelMapper;

    public List<TicketResponseDto> createTicket(TicketCreationRequestDto ticketCreationRequestDto, int quantity, UUID userId, OrderResponseDto orderDto) {
        List<Ticket> tickets = new ArrayList<>();
        while(quantity > 0) {
            try {
                var ticket = ticketRepository.save(Ticket.builder()
                        .status(Status.CONFIRMED)
                        .ticketType(Optional.of(ticketTypeService.getTicketTypeById(ticketCreationRequestDto.getTicketTypeId()))
                                .map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class)).orElseThrow())
                        .qr(Optional.of(qrService.createQR())
                                .map(qrResponseDto -> modelMapper.map(qrResponseDto, QR.class)).orElseThrow())
                        .order(modelMapper.map(orderDto, Order.class))
                        .build());

                tickets.add(ticket);
            } catch (WriterException | IOException e) {
                throw new QRCreationException("QR Creation Exception: " + e.getMessage());
            }
            quantity--;
        }

        emailService.sendTicketEmail(userService.getUserById(userId).getEmail(), tickets.stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class)).orElseThrow())
                        .qr(Optional.of(ticket.getQr())
                                .map(qr -> modelMapper.map(qr, QRResponseDto.class)).orElseThrow())
                        .build()).toList());

        return tickets.stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class)).orElseThrow())
                        .qr(Optional.of(ticket.getQr())
                                .map(qr -> modelMapper.map(qr, QRResponseDto.class)).orElseThrow())
                        .build()).toList();
    }

    public Boolean validateTicket(UUID qrId) {
        return qrService.validateQR(qrId);
    }

    public void cancelTicket(UUID userId, UUID ticketId) {
        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
        if(!ticket.getOrder().getUser().getId().equals(userId)) {
            throw new TicketNotFoundException("Ticket not found");
        }
        ticket.setStatus(Status.CANCELED);
        ticketRepository.save(ticket);
    }

    public void adminCancelTicket(UUID ticketId) {
        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
        ticket.setStatus(Status.CANCELED);
        ticketRepository.save(ticket);
    }

    public List<TicketResponseDto> getTickets(UUID uuid) {
        return ticketRepository.findAllByOrderUserId(uuid).orElseThrow(() -> new TicketNotFoundException("Ticket not found"))
                .stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class)).orElseThrow())
                        .qr(Optional.of(ticket.getQr())
                                .map(qr -> modelMapper.map(qr, QRResponseDto.class)).orElseThrow())
                        .build())
                .toList();
    }

    public List<TicketResponseDto> getTicketsForEvent(UUID userId, UUID eventId) {
        return ticketRepository.findAllByOrderUserIdAndTicketTypeEventId(userId, eventId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"))
                .stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class)).orElseThrow())
                        .qr(Optional.of(ticket.getQr())
                                .map(qr -> modelMapper.map(qr, QRResponseDto.class)).orElseThrow())
                        .build())
                .toList();
    }
}
