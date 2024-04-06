package com.matei.backend.service;

import com.google.zxing.WriterException;
import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.order.OrderResponseDto;
import com.matei.backend.dto.response.shoppingCart.ShoppingCartItemResponseDto;
import com.matei.backend.dto.response.ticket.TicketResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeResponseDto;
import com.matei.backend.entity.*;
import com.matei.backend.entity.enums.Role;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.entity.enums.Status;
import com.matei.backend.exception.event.EventNotFoundException;
import com.matei.backend.exception.event.EventPastException;
import com.matei.backend.exception.resourceAccess.ValidatorResourceAccessException;
import com.matei.backend.exception.ticket.TicketCreationException;
import com.matei.backend.exception.ticket.TicketNotFoundException;
import com.matei.backend.repository.TicketRepository;
import com.matei.backend.service.util.EmailService;
import com.matei.backend.service.util.QRService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketTypeService ticketTypeService;
    private final QRService qrService;
    private final EmailService emailService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public void createTickets(Map<EventWithoutTicketArtistResponseDto, List<ShoppingCartItemResponseDto>> eventShoppingCartMap, UUID userId, OrderResponseDto orderDto) {
        Map<EventWithoutTicketArtistResponseDto, List<TicketResponseDto>> eventTicketMap = new HashMap<>();

        eventShoppingCartMap.forEach((eventResponseDto, shoppingCartItemResponseDtoList) -> {
            List<Ticket> tickets = new ArrayList<>();
            shoppingCartItemResponseDtoList.forEach(shoppingCartItemResponseDto -> {
                while(shoppingCartItemResponseDto.getQuantity() > 0) {
                    try {
                        var ticketType = modelMapper.map(ticketTypeService.getTicketTypeById(shoppingCartItemResponseDto.getTicketType().getId()), TicketType.class);
                        ticketType.setRemainingQuantity(ticketType.getRemainingQuantity() - 1);
                        ticketType = ticketTypeService.save(ticketType);
                        UUID id = UUID.randomUUID();
                        var ticket = ticketRepository.save(Ticket.builder()
                                .id(id)
                                .status(Status.CONFIRMED)
                                .ticketType(ticketType)
                                .image(qrService.createQRImage(id))
                                .scanned(false)
                                .order(modelMapper.map(orderDto, Order.class))
                                .build());

                        tickets.add(ticket);
                    } catch (WriterException | IOException e) {
                        throw new TicketCreationException("QR Creation Exception: " + e.getMessage());
                    }
                    shoppingCartItemResponseDto.setQuantity(shoppingCartItemResponseDto.getQuantity() - 1);
                }
            });
            eventTicketMap.put(eventResponseDto, tickets.stream().map(ticket -> modelMapper.map(ticket, TicketResponseDto.class)).toList());
        });

        emailService.sendTicketEmail(userService.getUserById(userId).getEmail(), eventTicketMap);
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
        cancel(ticket);
    }

    public void adminCancelTicket(UUID ticketId) {
        var ticket = ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
        cancel(ticket);
    }

    private void cancel(Ticket ticket) {
        var ticketType = ticket.getTicketType();
        ticketType.setTotalQuantity(ticketType.getRemainingQuantity() + 1);
        ticketTypeService.save(ticketType);
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

    public Long getTotalNumberOfTicketsSold(StatisticsFilter filter) {
        if(filter == StatisticsFilter.ALL) {
            return ticketRepository.count();
        }
        return ticketRepository.countByCreatedAtAfter(filter.getStartDate())
                .orElseThrow();
    }
}
