package com.aura.user.dto;

import com.aura.user.entity.Gender;
import jakarta.validation.constraints.*;

public class UserRequestDTO {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email should not exceed 150 characters")
    private String email;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 255, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$",
             message = "Password must contain at least one digit, one lowercase, one uppercase, and one special character")
    private String password;
    
    @Size(max = 100, message = "Display name should not exceed 100 characters")
    private String displayName;
    
    @Pattern(regexp = "^[0-9]{10,20}$", message = "Phone number must be between 10 and 20 digits")
    private String phoneNumber;
    
    private Gender gender;
    
    @Size(max = 50, message = "Country should not exceed 50 characters")
    private String country;
    
    @Size(max = 255, message = "Profile image URL should not exceed 255 characters")
    private String profileImageUrl;
    
    // No-args constructor
    public UserRequestDTO() {
    }
    
    // All-args constructor
    public UserRequestDTO(String email, String username, String password, 
                         String displayName, String phoneNumber, Gender gender, 
                         String country, String profileImageUrl) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.country = country;
        this.profileImageUrl = profileImageUrl;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public Gender getGender() {
        return gender;
    }
    
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
