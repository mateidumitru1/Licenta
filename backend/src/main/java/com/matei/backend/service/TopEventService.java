package com.matei.backend.service;

import com.matei.backend.dto.request.TopEventCreationRequestDto;
import com.matei.backend.dto.request.TopEventUpdateRequestDto;
import com.matei.backend.dto.response.TopEventResponseDto;
import com.matei.backend.entity.Event;
import com.matei.backend.entity.TopEvent;
import com.matei.backend.exception.TopEventAlreadyExistsException;
import com.matei.backend.exception.TopEventNotFoundException;
import com.matei.backend.repository.TopEventRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TopEventService {
    private final TopEventRepository topEventRepository;
    private final EventService eventService;
    private final ModelMapper modelMapper;

    public TopEventResponseDto createTopEventList(List<TopEventCreationRequestDto> topEventCreationRequestDtoList) {
        var topEvents = topEventCreationRequestDtoList.stream()
                .map(topEventCreationRequestDto -> {
                    if(topEventRepository.findByEventId(topEventCreationRequestDto.getEventId()).isPresent()) {
                        throw new TopEventAlreadyExistsException("Top event already exists");
                    }
                    var event = eventService.getEventById(topEventCreationRequestDto.getEventId());

                    var topEvent = new TopEvent();
                    topEvent.setEvent(modelMapper.map(event, Event.class));
                    topEvent.setCustomDescription(topEventCreationRequestDto.getCustomDescription());

                    return topEvent;
                })
                .toList();

        topEventRepository.saveAll(topEvents);

        return modelMapper.map(topEvents, TopEventResponseDto.class);
    }

    public TopEventResponseDto updateTopEvent(UUID id, TopEventUpdateRequestDto topEventUpdateRequestDto) {
        var topEvent = topEventRepository.findById(id).orElseThrow(() -> new TopEventNotFoundException("Top event not found"));

        topEvent.setCustomDescription(topEventUpdateRequestDto.getCustomDescription());

        return modelMapper.map(topEventRepository.save(topEvent), TopEventResponseDto.class);
    }

    public TopEventResponseDto getTopEventById(UUID id) {
        var topEvent = topEventRepository.findById(id).orElseThrow(() -> new TopEventNotFoundException("Top event not found"));

        return modelMapper.map(topEvent, TopEventResponseDto.class);
    }

    public List<TopEventResponseDto> getTopEvents() {
        var topEvents = topEventRepository.findAll();

        return topEvents.stream()
                .map(topEvent -> modelMapper.map(topEvent, TopEventResponseDto.class))
                .toList();
    }

    public void deleteTopEventById(UUID id) {
        topEventRepository.deleteById(id);
    }
}
