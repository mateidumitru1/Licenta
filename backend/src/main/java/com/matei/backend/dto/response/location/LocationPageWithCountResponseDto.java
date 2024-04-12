package com.matei.backend.dto.response.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LocationPageWithCountResponseDto {
    private Page<LocationWithoutEventListResponseDto> locationPage;
    private Long count;
}
