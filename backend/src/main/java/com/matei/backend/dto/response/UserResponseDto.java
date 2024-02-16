package com.matei.backend.dto.response;

import com.matei.backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
