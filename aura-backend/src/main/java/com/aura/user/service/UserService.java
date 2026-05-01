package com.aura.user.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder; // FIX: Use generic interface
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aura.artist.entity.Artist;
import com.aura.artist.repository.ArtistRepository;
import com.aura.user.dto.ForgotPasswordRequestDTO;
import com.aura.user.dto.LoginRequestDTO;
import com.aura.user.dto.LoginResponseDTO;
import com.aura.user.dto.ResetPasswordDTO;
import com.aura.user.dto.RoleDTO;
import com.aura.user.dto.UserProfileUpdateDTO;
import com.aura.user.dto.UserRequestDTO;
import com.aura.user.dto.UserResponseDTO;
import com.aura.user.entity.Role;
import com.aura.user.entity.RoleType;
import com.aura.user.entity.User;
import com.aura.user.exception.DuplicateResourceException;
import com.aura.user.exception.TokenExpiredException;
import com.aura.user.exception.UnauthorizedException;
import com.aura.user.exception.UserNotFoundException;
import com.aura.user.repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ArtistRepository artistRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder; // FIX: Use PasswordEncoder interface

    // Constructor-based dependency injection
    public UserService(UserRepository userRepository,
            EmailService emailService,
            ArtistRepository artistRepository,
            JwtTokenProvider jwtTokenProvider,
            PasswordEncoder passwordEncoder) { // FIX: Use PasswordEncoder interface
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.artistRepository = artistRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    // FIX: Added helper for controller authorization checks
    public Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found for given email"))
                .getId();
    }

    /**
     * Create a new user with verification token
     */
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO dto) {
        // Check for duplicate email
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        // Check for duplicate username
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + dto.getUsername());
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));

        // Create user entity
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        // Hash password before storing
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPassword(hashedPassword);
        user.setDisplayName(dto.getDisplayName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setGender(dto.getGender());
        user.setCountry(dto.getCountry());
        user.setProfileImageUrl(dto.getProfileImageUrl());
        user.setIsVerified(false);
        user.setVerificationToken(otp);
        user.setTokenExpiryTime(LocalDateTime.now().plusMinutes(10)); // OTP expires in 10 minutes

        // Save user first to get the ID
        User savedUser = userRepository.save(user);

        // Add default USER role
        Role userRole = new Role(savedUser.getId(), RoleType.USER);
        savedUser.addRole(userRole);

        // Save again with roles
        savedUser = userRepository.save(savedUser);

        // Send verification email with OTP
        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getUsername(),
                otp);

        return convertToResponseDTO(savedUser);
    }

    /**
     * Verify user email using token
     */
    @Transactional
    public String verifyUser(String token) {
        // Find user by token
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new UserNotFoundException("Invalid verification token"));

        // Check if already verified
        if (user.getIsVerified()) {
            return "Email already verified";
        }

        // Check if token has expired
        if (user.getTokenExpiryTime().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Verification token has expired");
        }

        // Verify user
        user.setIsVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiryTime(null);

        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        return "Email verified successfully";
    }

    /**
     * Verify user email using OTP
     */
    @Transactional
    public String verifyUserWithOtp(String email, String otp) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        // Check if already verified
        if (user.getIsVerified()) {
            return "Email already verified";
        }

        // Check if OTP matches
        if (!otp.equals(user.getVerificationToken())) {
            throw new UnauthorizedException("Invalid verification code");
        }

        // Check if OTP has expired
        if (user.getTokenExpiryTime().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Verification code has expired");
        }

        // Verify user
        user.setIsVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiryTime(null);

        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        return "Email verified successfully";
    }

    /**
     * Resend verification email
     */
    @Transactional
    public String resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        // Check if already verified
        if (user.getIsVerified()) {
            throw new IllegalArgumentException("Email already verified");
        }

        // Generate new OTP
        String newOtp = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setVerificationToken(newOtp);
        user.setTokenExpiryTime(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);

        // Send new verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), newOtp);

        return "Verification email sent successfully";
    }

    /**
     * Get all users
     */
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user by ID
     */
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return convertToResponseDTO(user);
    }

    /**
     * Update existing user
     */
    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + dto.getEmail());
        }

        // Check if username is being changed and if it already exists
        if (!user.getUsername().equals(dto.getUsername()) && userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + dto.getUsername());
        }

        // Update user fields
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            // FIX: Password must be hashed here as well
            String hashedPassword = passwordEncoder.encode(dto.getPassword());
            user.setPassword(hashedPassword);
        }
        user.setDisplayName(dto.getDisplayName());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setGender(dto.getGender());
        user.setCountry(dto.getCountry());
        user.setProfileImageUrl(dto.getProfileImageUrl());

        User updatedUser = userRepository.save(user);
        return convertToResponseDTO(updatedUser);
    }

    /**
     * Delete user by ID
     */
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Add role to user
     */
    @Transactional
    public UserResponseDTO addRoleToUser(Long id, String roleStr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        RoleType roleType;
        try {
            // FIX: Added ARTIST to valid roles comment in exception
            roleType = RoleType.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr + ". Valid roles are: USER, ADMIN, ARTIST");
        }

        // Check if role already exists
        boolean roleExists = user.getRoles().stream()
                .anyMatch(r -> r.getRole().equals(roleType));

        if (roleExists) {
            throw new DuplicateResourceException("User already has role: " + roleType);
        }

        Role newRole = new Role(user.getId(), roleType);
        user.addRole(newRole);

        User updatedUser = userRepository.save(user);
        return convertToResponseDTO(updatedUser);
    }

    /**
     * Remove role from user
     */
    @Transactional
    public UserResponseDTO removeRoleFromUser(Long id, String roleStr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        RoleType roleType;
        try {
            // FIX: Added ARTIST to valid roles comment in exception
            roleType = RoleType.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + roleStr + ". Valid roles are: USER, ADMIN, ARTIST");
        }

        // Find and remove the role
        Role roleToRemove = user.getRoles().stream()
                .filter(r -> r.getRole().equals(roleType))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException("User does not have role: " + roleType));

        user.removeRole(roleToRemove);

        User updatedUser = userRepository.save(user);
        return convertToResponseDTO(updatedUser);
    }

    /**
     * User Login
     */
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {

        // Step 1: Find user by email
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Step 2: Check if email is verified
        if (!user.getIsVerified()) {
            throw new UnauthorizedException("Email not verified. Please verify your email first.");
        }

        // Step 3: Validate password
        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Step 4: Generate JWT token
        // FIX: The generateToken method in JwtTokenProvider was updated to accept
        // username
        String jwtToken = jwtTokenProvider.generateToken(user.getEmail(), user.getId(), user.getUsername());

        // Step 5: Return login response with token
        return new LoginResponseDTO(
                jwtToken,
                user.getId(),
                user.getUsername(),
                user.getEmail());
    }

    /**
     * Request password reset
     */
    @Transactional
    public String forgotPassword(ForgotPasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + request.getEmail()));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();

        // Set token expiry to 1 hour
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiry(LocalDateTime.now().plusHours(1));

        userRepository.save(user);

        // Send reset email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), resetToken);

        return "Password reset email sent successfully";
    }

    /**
     * Reset password using token
     */
    @Transactional
    public String resetPassword(ResetPasswordDTO resetPasswordDTO) {
        User user = userRepository.findByPasswordResetToken(resetPasswordDTO.getToken())
                .orElseThrow(() -> new UserNotFoundException("Invalid password reset token"));

        // Check if token has expired
        if (user.getPasswordResetExpiry().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Password reset token has expired");
        }

        // Hash new password
        String hashedPassword = passwordEncoder.encode(resetPasswordDTO.getNewPassword());
        user.setPassword(hashedPassword);

        // Clear reset token
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);

        userRepository.save(user);

        return "Password reset successfully";
    }

    /**
     * Update user profile (non-sensitive fields)
     */
    @Transactional
    public UserResponseDTO updateProfile(Long id, UserProfileUpdateDTO profileUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Update profile fields
        if (profileUpdateDTO.getDisplayName() != null && !profileUpdateDTO.getDisplayName().isEmpty()) {
            user.setDisplayName(profileUpdateDTO.getDisplayName());
        }

        if (profileUpdateDTO.getPhoneNumber() != null && !profileUpdateDTO.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(profileUpdateDTO.getPhoneNumber());
        }

        if (profileUpdateDTO.getCountry() != null && !profileUpdateDTO.getCountry().isEmpty()) {
            user.setCountry(profileUpdateDTO.getCountry());
        }

        if (profileUpdateDTO.getBio() != null && !profileUpdateDTO.getBio().isEmpty()) {
            user.setBio(profileUpdateDTO.getBio());
        }

        if (profileUpdateDTO.getAvatarUrl() != null && !profileUpdateDTO.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl(profileUpdateDTO.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);
        return convertToResponseDTO(updatedUser);
    }

    /**
     * Get user profile
     */
    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return convertToResponseDTO(user);
    }

    /**
     * Update convertToResponseDTO to include new fields
     */
    private UserResponseDTO convertToResponseDTO(User user) {
        Set<RoleDTO> roleDTOs = user.getRoles().stream()
                .map(role -> new RoleDTO(role.getRole()))
                .collect(Collectors.toSet());

        UserResponseDTO dto = new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getDisplayName(),
                user.getPhoneNumber(),
                user.getGender(),
                user.getCountry(),
                user.getProfileImageUrl(),
                user.getIsVerified(),
                roleDTOs,
                user.getBio(),
                user.getAvatarUrl());

        return dto;
    }

    // FIX: Removed redundant inline Artist creation logic
    @Transactional
    public UserResponseDTO promoteToArtist(Long userId) {
        logger.info("========== START: promoteToArtist for userId: {} ==========", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        System.out.println("✅ User found: " + user.getUsername());

        // Check if already artist
        boolean isArtist = user.getRoles().stream()
                .anyMatch(r -> r.getRole() == RoleType.ARTIST);

        if (isArtist) {
            System.out.println("User already has ARTIST role");
            throw new DuplicateResourceException("User is already an ARTIST");
        }

        // Add ARTIST role
        Role artistRole = new Role();
        artistRole.setUserId(user.getId());
        artistRole.setRole(RoleType.ARTIST);
        user.getRoles().add(artistRole);

        System.out.println("✅ ARTIST role added, saving user...");
        User updatedUser = userRepository.save(user);
        System.out.println("✅ User saved successfully");

        // ✅ CREATE ARTIST PROFILE - Use helper method
        createArtistProfile(userId, user.getUsername());

        System.out.println("========== END: promoteToArtist ==========\n");
        return convertToResponseDTO(updatedUser);
    }

    /**
     * Helper method to create artist profile automatically when user becomes ARTIST
     */
    // FIX: Removed @Transactional since it's called by a transactional method
    private void createArtistProfile(Long userId, String username) {
        try {
            // Check if artist already exists
            Artist existingArtist = artistRepository.findByUserId(userId);
            if (existingArtist != null) {
                System.out.println("Artist profile already exists for userId: " + userId);
                return;
            }

            // Create new artist profile
            Artist artist = new Artist();
            artist.setUserId(userId);
            artist.setStageName(username); // Default stage name = username
            artist.setBio(""); // Empty bio initially
            artist.setProfileImageUrl(null);
            artist.setHeaderImageUrl(null);

            Artist savedArtist = artistRepository.save(artist);
            System.out.println("✅ Artist profile created successfully for userId: " + userId + ", artistId: "
                    + savedArtist.getArtistId());

        } catch (Exception e) {
            System.err.println("❌ Error creating artist profile for userId: " + userId);
            e.printStackTrace();
            // FIX: Removed the throw new RuntimeException to ensure User promotion rollback
            // doesn't occur
            // due to failure in the Artist creation logic.
        }
    }
}