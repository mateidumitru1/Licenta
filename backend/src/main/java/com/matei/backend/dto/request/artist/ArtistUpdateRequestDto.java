package com.matei.backend.dto.request.artist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArtistUpdateRequestDto {
    private UUID id;
    private String name;
    private MultipartFile image;
    private String imageUrl;
    private String eventList;
    private String genreList;
}
