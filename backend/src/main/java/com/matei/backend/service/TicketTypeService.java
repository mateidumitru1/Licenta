package com.matei.backend.service;

import com.matei.backend.dto.request.TicketTypeCreationRequestDto;
import com.matei.backend.dto.request.TicketTypeUpdateRequestDto;
import com.matei.backend.dto.response.EventResponseDto;
import com.matei.backend.dto.response.TicketTypeResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.TicketType;
import com.matei.backend.exception.TicketTypeNotFoundException;
import com.matei.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;

    public TicketTypeResponseDto createTicketType(TicketTypeCreationRequestDto ticketTypeCreationRequestDto, EventResponseDto eventResponseDto) {
        var ticketType = ticketTypeRepository.save(TicketType.builder()
                .name(ticketTypeCreationRequestDto.getName())
                .price(ticketTypeCreationRequestDto.getPrice())
                .quantity(ticketTypeCreationRequestDto.getQuantity())
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
                .event(EventResponseDto.builder()
                        .id(ticketType.getEvent().getId())
                        .title(ticketType.getEvent().getTitle())
                        .date(ticketType.getEvent().getDate())
                        .shortDescription(ticketType.getEvent().getShortDescription())
                        .description(ticketType.getEvent().getDescription())
                        .location(ticketType.getEvent().getLocation())
                        .imageUrl(ticketType.getEvent().getImageUrl())
                        .build())
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
        return ticketTypeRepository.findByEventId(eventId).orElseThrow(() -> new TicketTypeNotFoundException("Ticket types not found")).stream()
                .map(ticketType -> TicketTypeResponseDto.builder()
                        .id(ticketType.getId())
                        .name(ticketType.getName())
                        .price(ticketType.getPrice())
                        .quantity(ticketType.getQuantity())
                        .build())
                .toList();
    }

    public void updateTicketTypes(List<TicketTypeUpdateRequestDto> ticketTypeUpdateRequestDtoList, EventResponseDto event) {
        var ticketTypes = ticketTypeRepository.findByEventId(event.getId()).orElseThrow(() -> new TicketTypeNotFoundException("Ticket types not found"));

        ticketTypeUpdateRequestDtoList = ticketTypeUpdateRequestDtoList.stream()
                .filter(ticketTypeUpdateRequestDto -> {
                    if (ticketTypeUpdateRequestDto.getId() == null) {
                        ticketTypeRepository.save(TicketType.builder()
                                .name(ticketTypeUpdateRequestDto.getName())
                                .price(ticketTypeUpdateRequestDto.getPrice())
                                .quantity(ticketTypeUpdateRequestDto.getQuantity())
                                .event(Event.builder()
                                        .id(event.getId())
                                        .title(event.getTitle())
                                        .date(event.getDate())
                                        .shortDescription(event.getShortDescription())
                                        .description(event.getDescription())
                                        .location(event.getLocation())
                                        .imageUrl(event.getImageUrl())
                                        .build())
                                .build());
                        return false;
                    }
                    return true;
                })
                .toList();

        List<TicketTypeUpdateRequestDto> finalTicketTypeUpdateRequestDtoList = new ArrayList<>(ticketTypeUpdateRequestDtoList);
        List<TicketType> ticketTypesToDelete = new ArrayList<>();

        ticketTypes.forEach(ticketType -> {
            if(finalTicketTypeUpdateRequestDtoList.stream().anyMatch(dto -> dto.getId().equals(ticketType.getId()))) {
                TicketTypeUpdateRequestDto ticketTypeUpdateRequestDto = finalTicketTypeUpdateRequestDtoList.stream()
                        .filter(dto -> dto.getId().equals(ticketType.getId()))
                        .findFirst()
                        .orElseThrow();

                ticketType.setName(ticketTypeUpdateRequestDto.getName());
                ticketType.setPrice(ticketTypeUpdateRequestDto.getPrice());
                ticketType.setQuantity(ticketTypeUpdateRequestDto.getQuantity());

                ticketTypeRepository.save(ticketType);
            } else {
                ticketTypesToDelete.add(ticketType);
            }
        });

        ticketTypeRepository.deleteAll(ticketTypesToDelete);
    }
}
