package com.aura.user.repository;

import com.aura.user.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email address
     * @param email the email to search for
     * @return Optional containing user if found
     */
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by username
     * @param username the username to search for
     * @return Optional containing user if found
     */
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByUsername(String username);
    
    /**
     * Check if email already exists
     * @param email the email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);
    
    /**
     * Check if username already exists
     * @param username the username to check
     * @return true if username exists, false otherwise
     */
    boolean existsByUsername(String username);
    
    /**
     * Find user by verification token
     * @param token the verification token
     * @return Optional containing user if found
     */
    Optional<User> findByVerificationToken(String token);
    
    /**
     * Find user by password reset token
     */
    Optional<User> findByPasswordResetToken(String token);

}
