package com.matei.backend.dto.request.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

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
    private String artistIdList;
    private String ticketTypesList;
    private String broadGenreId;
}
