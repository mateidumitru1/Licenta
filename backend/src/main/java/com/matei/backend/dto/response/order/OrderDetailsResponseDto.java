package com.matei.backend.dto.response.order;

import com.matei.backend.entity.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailsResponseDto {
    private UUID id;
    private String orderNumber;
    private Status status;
    private String createdAt;
    private Double price;
}
