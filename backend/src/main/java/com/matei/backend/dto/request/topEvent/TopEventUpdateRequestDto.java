package com.matei.backend.dto.request.topEvent;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopEventUpdateRequestDto {
    private UUID id;
    private String customDescription;
}
