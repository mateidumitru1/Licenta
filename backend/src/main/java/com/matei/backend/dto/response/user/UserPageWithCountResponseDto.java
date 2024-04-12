package com.matei.backend.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPageWithCountResponseDto {
    private Page<UserResponseDto> userPage;
    private Long count;
}
