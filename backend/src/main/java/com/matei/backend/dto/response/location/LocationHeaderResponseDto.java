package com.matei.backend.dto.response.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationHeaderResponseDto {
    private String name;
    private String address;
    private String imageUrl;
}
