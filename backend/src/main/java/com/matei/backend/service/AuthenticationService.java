package com.matei.backend.service;

import com.matei.backend.dto.request.AuthenticationRequestDto;
import com.matei.backend.dto.request.RegisterRequestDto;
import com.matei.backend.dto.response.AuthenticationResponseDto;
import com.matei.backend.dto.response.RegisterResponseDto;
import com.matei.backend.entity.BlackListedToken;
import com.matei.backend.entity.Role;
import com.matei.backend.entity.User;
import com.matei.backend.exception.InvalidCredentialsException;
import com.matei.backend.exception.ResetPasswordTokenExpiredException;
import com.matei.backend.exception.UserAlreadyExistsException;
import com.matei.backend.exception.UserNotFoundException;
import com.matei.backend.repository.BlackListedTokenRepository;
import com.matei.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final ResetPasswordTokenService resetPasswordTokenService;
    private final ModelMapper modelMapper;


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
        emailService.sendWelcomeEmail(user.getFirstName(), user.getUsername(), user.getEmail());

        return modelMapper.map(user, RegisterResponseDto.class);
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

    public void logout(String token) {

        jwtService.addToBlackList(token);
    }

    public void forgotPassword(String email) {
        var user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        var token = resetPasswordTokenService.save(resetPasswordTokenService.generateResetPasswordToken(user));
        emailService.sendResetPasswordEmail(email, token);
    }

    public void resetPassword(String token, String newPassword) {
        var resetPasswordToken = resetPasswordTokenService.findByToken(token);
        if(resetPasswordToken.getExpiration().isBefore(LocalDate.now().atStartOfDay())) {
            throw new ResetPasswordTokenExpiredException("Reset password token expired");
        }

        var user = resetPasswordToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetPasswordTokenService.delete(resetPasswordToken);
    }
}
