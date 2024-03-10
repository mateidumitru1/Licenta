package com.matei.backend.dto.request.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationUpdateRequestDto {
    private UUID id;
    private String name;
    private String address;
    private String imageUrl;
    private MultipartFile image;
}
