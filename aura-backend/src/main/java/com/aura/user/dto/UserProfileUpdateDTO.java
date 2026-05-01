package com.aura.user.dto;

import jakarta.validation.constraints.Size;

/**
 * DTO for updating user profile
 * Used for non-sensitive profile updates like bio, avatar, etc.
 */
public class UserProfileUpdateDTO {
    
    @Size(max = 100, message = "Display name should not exceed 100 characters")
    private String displayName;
    
    @Size(max = 20, message = "Phone number should not exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 50, message = "Country should not exceed 50 characters")
    private String country;
    
    @Size(max = 500, message = "Bio should not exceed 500 characters")
    private String bio;
    
    @Size(max = 255, message = "Avatar URL should not exceed 255 characters")
    private String avatarUrl;
    
    // Constructors
    public UserProfileUpdateDTO() {
    }
    
    public UserProfileUpdateDTO(String displayName, String phoneNumber, String country, String bio, String avatarUrl) {
        this.displayName = displayName;
        this.phoneNumber = phoneNumber;
        this.country = country;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }
    
    // Getters and Setters
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
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
