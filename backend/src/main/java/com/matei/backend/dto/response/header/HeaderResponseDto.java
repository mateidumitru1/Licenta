package com.matei.backend.dto.response.header;

import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HeaderResponseDto {
    private List<LocationWithoutEventListResponseDto> locations;
    private Integer shoppingCartSize;
}
