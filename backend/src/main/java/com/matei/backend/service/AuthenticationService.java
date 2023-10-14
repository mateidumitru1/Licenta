package com.matei.backend.service;

import com.matei.backend.dto.request.AuthenticationRequestDto;
import com.matei.backend.dto.request.RegisterRequestDto;
import com.matei.backend.dto.response.AuthenticationResponseDto;
import com.matei.backend.dto.response.RegisterResponseDto;
import com.matei.backend.entity.Role;
import com.matei.backend.entity.User;
import com.matei.backend.exception.InvalidCredentialsException;
import com.matei.backend.exception.UserAlreadyExistsException;
import com.matei.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public RegisterResponseDto register(RegisterRequestDto request) {

        if(userRepository.findByUsername(request.getUsername()).isPresent()
                || userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new UserAlreadyExistsException("User already exists");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return RegisterResponseDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .message("User registered successfully")
                .build();
    }

    public AuthenticationResponseDto authenticate(AuthenticationRequestDto request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }


        var user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponseDto.builder()
                .token(jwtToken)
                .build();
    }
}
