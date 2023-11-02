package com.matei.backend.dto.request;

import com.matei.backend.dto.response.EventResponseDto;
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
public class LocationUpdateRequestDto {
    private UUID id;
    private String name;
    private String address;
    private String imageUrl;
    private MultipartFile image;
}
