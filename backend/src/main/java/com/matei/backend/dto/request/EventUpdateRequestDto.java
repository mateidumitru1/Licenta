package com.matei.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Nullable;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventUpdateRequestDto {
    private UUID id;
    private String title;
    private String date;
    private String shortDescription;
    private String description;
    private String imageUrl;
    private MultipartFile image;
    private UUID locationId;
    private String ticketTypes;
}
