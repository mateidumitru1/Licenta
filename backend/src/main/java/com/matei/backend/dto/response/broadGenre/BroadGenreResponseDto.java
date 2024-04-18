package com.matei.backend.dto.response.broadGenre;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BroadGenreResponseDto {
    private String id;
    private String name;
}
