package com.matei.backend.service.auth;

import com.matei.backend.entity.BlackListedToken;
import com.matei.backend.entity.User;
import com.matei.backend.repository.BlackListedTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final BlackListedTokenRepository blackListedTokenRepository;

    private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY");
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public UUID extractId(String token) {
        return UUID.fromString(extractClaim(token.substring(7), claims -> claims.get("id", String.class)));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("id", user.getId());
        return generateToken(claims, user);
    }

    public String generateToken(Map<String, Object> claims, User user) {
        return Jwts
                .builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean isTokenValid(String token, User user) {
        String username = extractUsername(token);
        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public void addToBlackList(String token) {

        var jwtToken = BlackListedToken
                .builder()
                .token(token.substring(7))
                .timestamp(LocalDateTime.now())
                .build();

        blackListedTokenRepository.save(jwtToken);
    }

    public boolean isTokenBlacklisted(String token) {
        return blackListedTokenRepository.findByToken(token.substring(7)).isPresent();
    }
}
