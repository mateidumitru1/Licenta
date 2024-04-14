package com.matei.backend.dto.response.preference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserGenrePreferenceResponseDto {
    private String broadGenre;
    private Double percentage;
    private Long count;
}
