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
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public UserResponseDto createUser(UserCreationRequestDto userCreationRequestDto) {
        var user = userRepository.save(modelMapper.map(userCreationRequestDto, User.class));

        return modelMapper.map(user, UserResponseDto.class);
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> modelMapper.map(user, UserResponseDto.class)).toList();
    }

    public UserResponseDto getUserById(UUID id) {
        var user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

        return modelMapper.map(user, UserResponseDto.class);
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
        return getUserById(userRequestDto.getId());
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
