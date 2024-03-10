package com.matei.backend.service;

import com.matei.backend.dto.request.ticketType.TicketTypeCreationRequestDto;
import com.matei.backend.dto.request.ticketType.TicketTypeUpdateRequestDto;
import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.TicketType;
import com.matei.backend.exception.TicketTypeNotFoundException;
import com.matei.backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;
    private final ModelMapper modelMapper;

    public TicketType save(TicketType ticketType) {
        return ticketTypeRepository.save(ticketType);
    }

    public TicketTypeResponseDto createTicketType(TicketTypeCreationRequestDto ticketTypeCreationRequestDto, EventWithoutArtistListResponseDto eventResponseDto) {
        var ticketTypeToAdd = modelMapper.map(ticketTypeCreationRequestDto, TicketType.class);
        ticketTypeToAdd.setEvent(modelMapper.map(eventResponseDto, Event.class));
        var ticketType = ticketTypeRepository.save(ticketTypeToAdd);

        return modelMapper.map(ticketType, TicketTypeResponseDto.class);
    }

    public TicketTypeResponseDto getTicketTypeById(UUID id) {
        var ticketType = ticketTypeRepository.findById(id).orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found"));

        return modelMapper.map(ticketType, TicketTypeResponseDto.class);
    }

    public List<TicketTypeResponseDto> getAllTicketTypes() {
        return ticketTypeRepository.findAll().stream()
                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class))
                .toList();
    }

    public List<TicketTypeResponseDto> getTicketTypesByEventId(UUID eventId) {
        return ticketTypeRepository.findByEventId(eventId).orElseThrow(() -> new TicketTypeNotFoundException("Ticket types not found")).stream()
                .map(ticketType -> modelMapper.map(ticketType, TicketTypeResponseDto.class))
                .toList();
    }

    public void updateTicketTypes(List<TicketTypeUpdateRequestDto> ticketTypeUpdateRequestDtoList, EventWithoutArtistListResponseDto event) {
        var ticketTypes = ticketTypeRepository.findByEventId(event.getId()).orElseThrow(() -> new TicketTypeNotFoundException("Ticket types not found"));

        ticketTypeUpdateRequestDtoList = ticketTypeUpdateRequestDtoList.stream()
                .filter(ticketTypeUpdateRequestDto -> {
                    if (ticketTypeUpdateRequestDto.getId() == null) {
                        ticketTypeRepository.save(modelMapper.map(ticketTypeUpdateRequestDto, TicketType.class));
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
