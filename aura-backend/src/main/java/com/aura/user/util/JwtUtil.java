package com.aura.user.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.aura.user.entity.RoleType;
import com.aura.user.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration}")
    private Long expirationTime;

    // ✅ CHECK IF ARTIST
    public static boolean isArtist(User user) {
        return user.getRoles().stream()
            .anyMatch(role -> role.getRole() == RoleType.ARTIST);
    }

    // ✅ CHECK IF USER
    public static boolean isUser(User user) {
        return user.getRoles().stream()
            .anyMatch(role -> role.getRole() == RoleType.USER);
    }

    // ✅ GENERATE JWT TOKEN
    public String generateToken(String email, Long userId, String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);
    SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

    return Jwts.builder()
        .setSubject(email)
        .claim("userId", userId)
        .claim("username", username)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(key, SignatureAlgorithm.HS512)
        .compact();
    }

    // ✅ GET EMAIL FROM TOKEN
    public String getEmailFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // ✅ GET USER ID FROM TOKEN
    public Long getUserIdFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return ((Number) claims.get("userId")).longValue();
    }

    // ✅ GET USERNAME FROM TOKEN
    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return (String) claims.get("username");
    }

    // ✅ VALIDATE TOKEN
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
