package com.matei.backend.dto.response.user;

import com.matei.backend.dto.response.order.OrderResponseDto;
import com.matei.backend.dto.response.preference.UserGenrePreferenceResponseDto;
import com.matei.backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserWithOrdersResponseDto {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private List<OrderResponseDto> orderList;
    private List<UserGenrePreferenceResponseDto> genrePreferences;
}
