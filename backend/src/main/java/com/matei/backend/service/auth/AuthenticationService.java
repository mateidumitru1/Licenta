package com.matei.backend.service.auth;

import com.matei.backend.dto.request.auth.AuthenticationRequestDto;
import com.matei.backend.dto.request.auth.RegisterRequestDto;
import com.matei.backend.dto.response.auth.AuthenticationResponseDto;
import com.matei.backend.dto.response.auth.RegisterResponseDto;
import com.matei.backend.entity.enums.Role;
import com.matei.backend.entity.User;
import com.matei.backend.exception.auth.InvalidCredentialsException;
import com.matei.backend.exception.tokens.ResetPasswordTokenExpiredException;
import com.matei.backend.exception.tokens.VerifyAccountTokenExpiredException;
import com.matei.backend.exception.user.UserAlreadyEnabledException;
import com.matei.backend.exception.user.UserAlreadyExistsException;
import com.matei.backend.exception.user.UserNotEnabledException;
import com.matei.backend.exception.user.UserNotFoundException;
import com.matei.backend.repository.UserRepository;
import com.matei.backend.service.util.EmailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final ResetPasswordTokenService resetPasswordTokenService;
    private final VerifyAccountTokenService verifyAccountTokenService;
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
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .build();

        var createdUser = userRepository.save(user);

        emailService.sendWelcomeEmail(createdUser.getFirstName(), createdUser.getUsername(), createdUser.getEmail());
        var token = verifyAccountTokenService.save(verifyAccountTokenService.generateVerifyAccountToken(user));
        emailService.sendVerifyAccountEmail(user.getEmail(), user.getUsername(), token.getToken());

        return modelMapper.map(createdUser, RegisterResponseDto.class);
    }

    public AuthenticationResponseDto authenticate(AuthenticationRequestDto loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (DisabledException e) {
            throw new UserNotEnabledException("User not enabled");
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        var user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

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

    public void resendVerifyAccountEmail(String email) {
        var user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));
        if(user.isEnabled()) {
            throw new UserAlreadyEnabledException("User already enabled");
        }
        var verifyAccountToken = verifyAccountTokenService.findByUser(user);
        if(verifyAccountToken != null) {
            verifyAccountTokenService.delete(verifyAccountToken);
        }
        var token = verifyAccountTokenService.save(verifyAccountTokenService.generateVerifyAccountToken(user));
        emailService.sendVerifyAccountEmail(user.getEmail(), user.getUsername(), token.getToken());
    }

    public void verifyAccount(String token) {
        var verifyAccountToken = verifyAccountTokenService.findByToken(token);
        if(verifyAccountToken.getUser().isEnabled()) {
            throw new UserAlreadyEnabledException("User already enabled");
        }
        if(verifyAccountToken.getExpiration().isBefore(LocalDate.now().atStartOfDay())) {
            throw new VerifyAccountTokenExpiredException("Verify account token expired");
        }

        var user = verifyAccountToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        verifyAccountTokenService.delete(verifyAccountToken);
    }
}
