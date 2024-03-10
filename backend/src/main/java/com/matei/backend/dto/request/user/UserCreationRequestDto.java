package com.matei.backend.dto.request.user;

import com.matei.backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequestDto {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
