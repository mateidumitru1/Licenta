package com.matei.backend.dto.response.event;

import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SelectedEventResponseDto {
    private UUID id;
    private String title;
    private LocalDate date;
    private LocationWithoutEventListResponseDto location;
    private String imageUrl;
    private Boolean selected;
}
