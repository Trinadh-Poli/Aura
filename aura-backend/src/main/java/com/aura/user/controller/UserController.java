package com.aura.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // 💡 ADDED
import org.springframework.security.core.userdetails.UserDetails; // 💡 ADDED
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aura.user.dto.ForgotPasswordRequestDTO;
import com.aura.user.dto.LoginRequestDTO;
import com.aura.user.dto.LoginResponseDTO;
import com.aura.user.dto.ResetPasswordDTO;
import com.aura.user.dto.UserProfileUpdateDTO;
import com.aura.user.dto.UserRequestDTO;
import com.aura.user.dto.UserResponseDTO;
import com.aura.user.exception.UnauthorizedException; // 💡 ADDED
import com.aura.user.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** Public Endpoints **/

    @PostMapping
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO createdUser = userService.createUser(userRequestDTO);

        Map<String, Object> response = Map.of(
                "message", "User registered successfully. Please check your email to verify your account.",
                "user", createdUser);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyUser(@RequestParam String token) {
        String message = userService.verifyUser(token);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String message = userService.verifyUserWithOtp(email, otp);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerificationEmail(
            @RequestBody Map<String, String> request) {
        String email = request.get("email");
        String message = userService.resendVerificationEmail(email);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequestDTO loginRequestDTO) {

        LoginResponseDTO loginResponse = userService.login(loginRequestDTO);

        Map<String, Object> response = Map.of(
                "message", "Login successful",
                "data", loginResponse);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO forgotPasswordRequest) {
        String message = userService.forgotPassword(forgotPasswordRequest);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody ResetPasswordDTO resetPasswordDTO) {
        String message = userService.resetPassword(resetPasswordDTO);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /** Authenticated & Admin/Self Endpoints **/

    // ✅ GET ALL USERS (Requires ADMIN role)
    // Assuming you will add @PreAuthorize("hasRole('ADMIN')") later in your
    // codebase
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ✅ GET USER BY ID (Publicly viewable profile, or authenticated)
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // 💡 SECURITY FIX: Check if authenticated user matches target ID
    // (Self-Modification)
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal, // 💡 ADDED
            @Valid @RequestBody UserRequestDTO userRequestDTO) {

        Long authenticatedUserId = userService.getUserIdFromEmail(principal.getUsername());

        // 💡 Check if they are modifying their own profile (or add ADMIN check later)
        if (!authenticatedUserId.equals(id)) {
            throw new UnauthorizedException("You are not authorized to update this user account.");
        }

        UserResponseDTO updatedUser = userService.updateUser(id, userRequestDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // 💡 SECURITY FIX: Check if authenticated user matches target ID
    // (Self-Deletion)
    // Should generally require ADMIN permission to delete users, but at minimum,
    // protect others' accounts.
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) { // 💡 ADDED

        Long authenticatedUserId = userService.getUserIdFromEmail(principal.getUsername());

        // 💡 Check if they are deleting their own account
        if (!authenticatedUserId.equals(id)) {
            throw new UnauthorizedException("You are not authorized to delete this user account.");
        }

        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // ✅ ADD ROLE (Requires ADMIN role - no self-check needed, Admin only)
    // Assuming you will add @PreAuthorize("hasRole('ADMIN')") later in your
    // codebase
    @PostMapping("/{id}/roles")
    public ResponseEntity<UserResponseDTO> addRoleToUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> roleRequest) {
        String role = roleRequest.get("role");
        UserResponseDTO updatedUser = userService.addRoleToUser(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    // ✅ REMOVE ROLE (Requires ADMIN role)
    // Assuming you will add @PreAuthorize("hasRole('ADMIN')") later in your
    // codebase
    @DeleteMapping("/{id}/roles/{role}")
    public ResponseEntity<UserResponseDTO> removeRoleFromUser(
            @PathVariable Long id,
            @PathVariable String role) {
        UserResponseDTO updatedUser = userService.removeRoleFromUser(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    // 💡 SECURITY FIX: Check if authenticated user matches target ID
    // (Self-Modification)
    @PutMapping("/{id}/profile")
    public ResponseEntity<UserResponseDTO> updateProfile(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal, // 💡 ADDED
            @Valid @RequestBody UserProfileUpdateDTO profileUpdateDTO) {

        Long authenticatedUserId = userService.getUserIdFromEmail(principal.getUsername());

        // 💡 Check if they are updating their own profile
        if (!authenticatedUserId.equals(id)) {
            throw new UnauthorizedException("You are not authorized to update this profile.");
        }

        UserResponseDTO updatedProfile = userService.updateProfile(id, profileUpdateDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    // ✅ GET USER PROFILE (No security check needed as the ID is in the path)
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserResponseDTO> getUserProfile(@PathVariable Long id) {
        UserResponseDTO profile = userService.getUserProfile(id);
        return ResponseEntity.ok(profile);
    }

    // 💡 SECURITY FIX: Check if authenticated user matches target ID
    // (Self-Promotion)
    @PutMapping("/{userId}/switch-to-artist")
    public ResponseEntity<Map<String, Object>> switchToArtist(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails principal) { // 💡 ADDED

        Long authenticatedUserId = userService.getUserIdFromEmail(principal.getUsername());

        // 💡 Check if they are promoting their own account
        if (!authenticatedUserId.equals(userId)) {
            throw new UnauthorizedException("You can only promote your own account to Artist.");
        }

        UserResponseDTO promotedUser = userService.promoteToArtist(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "You are now an ARTIST and can upload songs!");
        response.put("user", promotedUser);

        return ResponseEntity.ok(response);
    }

}