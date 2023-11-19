package com.matei.backend.service;

import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.TicketTypeResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.TicketType;
import com.matei.backend.exception.TicketTypeNotFoundException;
import com.matei.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;

    public TicketTypeResponseDto createTicketType(TicketTypeCreationRequestDto ticketTypeCreationRequestDto, EventResponseDto eventResponseDto) {
        var ticketType = ticketTypeRepository.save(TicketType.builder()
                .name(ticketTypeCreationRequestDto.getName())
                .price(Double.valueOf(ticketTypeCreationRequestDto.getPrice()))
                .quantity(Integer.valueOf(ticketTypeCreationRequestDto.getQuantity()))
                .event(Event.builder()
                        .id(eventResponseDto.getId())
                        .title(eventResponseDto.getTitle())
                        .date(eventResponseDto.getDate())
                        .shortDescription(eventResponseDto.getShortDescription())
                        .description(eventResponseDto.getDescription())
                        .location(eventResponseDto.getLocation())
                        .imageUrl(eventResponseDto.getImageUrl())
                        .build())
                .build());

        return TicketTypeResponseDto.builder()
                .id(ticketType.getId())
                .name(ticketType.getName())
                .price(ticketType.getPrice())
                .quantity(ticketType.getQuantity())
                .build();
    }

    public TicketTypeResponseDto getTicketTypeById(UUID id) {
        var ticketType = ticketTypeRepository.findById(id).orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found"));

        return TicketTypeResponseDto.builder()
                .id(ticketType.getId())
                .name(ticketType.getName())
                .price(ticketType.getPrice())
                .quantity(ticketType.getQuantity())
                .build();
    }

    public List<TicketTypeResponseDto> getAllTicketTypes() {
        return ticketTypeRepository.findAll().stream()
                .map(ticketType -> TicketTypeResponseDto.builder()
                        .id(ticketType.getId())
                        .name(ticketType.getName())
                        .price(ticketType.getPrice())
                        .quantity(ticketType.getQuantity())
                        .build())
                .toList();
    }

    public List<TicketTypeResponseDto> getTicketTypesByEventId(UUID eventId) {
        return ticketTypeRepository.findByEventId(eventId).stream()
                .map(ticketType -> TicketTypeResponseDto.builder()
                        .id(ticketType.getId())
                        .name(ticketType.getName())
                        .price(ticketType.getPrice())
                        .quantity(ticketType.getQuantity())
                        .build())
                .toList();
    }
}
