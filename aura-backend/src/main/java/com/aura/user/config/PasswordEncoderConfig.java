package com.aura.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Configuration class for password encoding
 * Provides BCryptPasswordEncoder bean for password hashing
 */
@Configuration
public class PasswordEncoderConfig {
    
    /**
     * Create BCryptPasswordEncoder bean
     * Strength 10 means 2^10 = 1024 hashing rounds
     * More rounds = more secure but slower
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);  // Strength factor 10
    }
}
