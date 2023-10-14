package com.matei.backend.dto.response;

import com.matei.backend.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaceResponseDto {
    private UUID id;
    private String name;
    private String address;
    private String imageUrl;
    private List<Event> events;
}
