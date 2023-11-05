package com.matei.backend.service;

import com.matei.backend.dto.request.AuthenticationRequestDto;
import com.matei.backend.dto.request.RegisterRequestDto;
import com.matei.backend.dto.request.UserCreationRequestDto;
import com.matei.backend.dto.request.UserRequestDto;
import com.matei.backend.dto.response.UserResponseDto;
import com.matei.backend.entity.ResetPasswordToken;
import com.matei.backend.entity.User;
import com.matei.backend.exception.UserNotFoundException;
import com.matei.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto createUser(UserCreationRequestDto userCreationRequestDto) {
        var user = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .username(userCreationRequestDto.getUsername())
                .email(userCreationRequestDto.getEmail())
                .password(passwordEncoder.encode(userCreationRequestDto.getPassword()))
                .firstName(userCreationRequestDto.getFirstName())
                .lastName(userCreationRequestDto.getLastName())
                .role(userCreationRequestDto.getRole())
                .build());

        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build()).toList();
    }

    public UserResponseDto updateUser(UserRequestDto userRequestDto) {
        userRepository.partialUpdateUser(
                userRequestDto.getId(),
                userRequestDto.getUsername(),
                userRequestDto.getEmail(),
                userRequestDto.getFirstName(),
                userRequestDto.getLastName(),
                userRequestDto.getRole()
        );
        return UserResponseDto.builder()
                .id(userRequestDto.getId())
                .username(userRequestDto.getUsername())
                .email(userRequestDto.getEmail())
                .firstName(userRequestDto.getFirstName())
                .lastName(userRequestDto.getLastName())
                .role(userRequestDto.getRole())
                .build();
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
