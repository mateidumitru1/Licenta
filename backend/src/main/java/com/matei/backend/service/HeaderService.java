package com.matei.backend.service;

import com.matei.backend.dto.response.header.HeaderResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HeaderService {
    private final LocationService locationService;
    private final ShoppingCartService shoppingCartService;

    public HeaderResponseDto getHeaderData(String userId) {
        if(Objects.equals(userId, "")) {
            return HeaderResponseDto.builder()
                    .locations(locationService.getAllLocations())
                    .shoppingCartSize(0)
                    .build();
        }
        return HeaderResponseDto.builder()
                .locations(locationService.getAllLocations())
                .shoppingCartSize(shoppingCartService.getShoppingCartSize(UUID.fromString(userId)))
                .build();
    }
}
