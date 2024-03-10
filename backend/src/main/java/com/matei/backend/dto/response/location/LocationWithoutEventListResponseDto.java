package com.matei.backend.dto.response.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationWithoutEventListResponseDto {
    private UUID id;
    private String name;
    private String address;
    private String imageUrl;
}
