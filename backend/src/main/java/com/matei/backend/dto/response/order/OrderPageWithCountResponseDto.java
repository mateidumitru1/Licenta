package com.matei.backend.dto.response.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderPageWithCountResponseDto {
    private Page<OrderDetailsResponseDto> orderPage;
    private Long count;
}
