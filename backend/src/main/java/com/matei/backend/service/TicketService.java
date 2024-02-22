package com.matei.backend.service;

import com.google.zxing.WriterException;
import com.matei.backend.dto.request.TicketCreationRequestDto;
import com.matei.backend.dto.response.*;
import com.matei.backend.entity.*;
import com.matei.backend.entity.enums.Role;
import com.matei.backend.entity.enums.Status;
import com.matei.backend.exception.*;
import com.matei.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
                UUID id = UUID.randomUUID();
                var ticket = ticketRepository.save(Ticket.builder()
                        .id(id)
                        .status(Status.CONFIRMED)
                        .ticketType(Optional.of(ticketTypeService.getTicketTypeById(ticketCreationRequestDto.getTicketTypeId()))
                                .map(ticketTypeResponseDto -> modelMapper.map(ticketTypeResponseDto, TicketType.class)).orElseThrow())
                        .image(qrService.createQRImage(id))
                        .scanned(false)
                        .order(modelMapper.map(orderDto, Order.class))
                        .build());

                tickets.add(ticket);
            } catch (WriterException | IOException e) {
                throw new TicketCreationException("QR Creation Exception: " + e.getMessage());
            }
            quantity--;
        }

        emailService.sendTicketEmail(userService.getUserById(userId).getEmail(), tickets.stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class)).orElseThrow())
                        .image(ticket.getImage())
                        .scanned(ticket.getScanned())
                        .build()).toList());

        return tickets.stream()
                .map(ticket -> TicketResponseDto.builder()
                        .id(ticket.getId())
                        .status(ticket.getStatus())
                        .ticketType(Optional.of(ticket.getTicketType())
                                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class)).orElseThrow())
                        .image(ticket.getImage())
                        .scanned(ticket.getScanned())
                        .build()).toList();
    }

    public TicketResponseDto validateTicket(UUID userId, UUID ticketId) {
        if(!userService.getUserById(userId).getRole().equals(Role.TICKET_VALIDATOR)) {
            throw new ValidatorResourceAccessException("You are not authorized to perform this action");
        }

        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        if(ticket.getTicketType().getEvent().getDate().isBefore(LocalDate.now())) {
            throw new EventPastException("Event has already passed");
        }
        if(ticket.getTicketType().getEvent() == null) {
            throw new EventNotFoundException("Event not found");
        }

        if(ticket.getStatus().equals(Status.CANCELED)) {
            return getTicketResponseDto(ticket, ticket, false);
        }
        if(ticket.getScanned()) {
            var ticketResponse = modelMapper.map(ticket, TicketResponseDto.class);
            return getTicketResponseDto(ticket, ticket, true);
        }

        ticket.setScannedAt(LocalDateTime.now());
        ticket.setScanned(true);
        var updatedTicket = ticketRepository.save(ticket);
        return getTicketResponseDto(ticket, updatedTicket, false);
    }

    private TicketResponseDto getTicketResponseDto(Ticket ticket, Ticket updatedTicket, Boolean alreadyScanned) {
        var ticketResponse = modelMapper.map(updatedTicket, TicketResponseDto.class);
        ticketResponse.setAlreadyScanned(alreadyScanned);
        ticketResponse.setUsername(ticket.getOrder().getUser().getUsername());
        ticketResponse.setUserFirstName(ticket.getOrder().getUser().getFirstName());
        ticketResponse.setUserLastName(ticket.getOrder().getUser().getLastName());
        ticketResponse.setUserEmail(ticket.getOrder().getUser().getEmail());
        return ticketResponse;
    }

    public void cancelTicket(UUID userId, UUID ticketId) {
        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
        if(!ticket.getOrder().getUser().getId().equals(userId)) {
            throw new TicketNotFoundException("Ticket not found");
        }
        ticket.setStatus(Status.CANCELED);
        ticket.setScanned(true);
        ticket.setScannedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
    }

    public void adminCancelTicket(UUID ticketId) {
        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
        ticket.setStatus(Status.CANCELED);
        ticket.setScanned(true);
        ticket.setScannedAt(LocalDateTime.now());
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
                        .image(ticket.getImage())
                        .scanned(ticket.getScanned())
                        .scannedAt(ticket.getScannedAt())
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
                        .image(ticket.getImage())
                        .scanned(ticket.getScanned())
                        .scannedAt(ticket.getScannedAt())
                        .build())
                .toList();
    }
}
