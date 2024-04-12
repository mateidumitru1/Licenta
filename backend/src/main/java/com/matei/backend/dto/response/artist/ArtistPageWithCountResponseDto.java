package com.matei.backend.dto.response.artist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistPageWithCountResponseDto {
    private Page<ArtistWithoutEventResponseDto> artistPage;
    private Long count;
}
