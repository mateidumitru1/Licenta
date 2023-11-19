package com.matei.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventCreationRequestDto {
    private String title;
    private String date;
    private String shortDescription;
    private String description;
    private MultipartFile image;
    private String locationId;
    private String ticketTypes;
}
