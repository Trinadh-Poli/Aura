package com.aura.user.dto;

import com.aura.user.entity.Gender;
import java.util.Set;

public class UserResponseDTO {
    
    private Long id;
    private String email;
    private String username;
    private String displayName;
    private String phoneNumber;
    private Gender gender;
    private String country;
    private String profileImageUrl;
    private Boolean isVerified;
    private Set<RoleDTO> roles;
    
    // No-args constructor
    public UserResponseDTO() {
    }
    
    // All-args constructor
    public UserResponseDTO(Long id, String email, String username, 
                          String displayName, String phoneNumber, Gender gender, 
                          String country, String profileImageUrl, Boolean isVerified,
                          Set<RoleDTO> roles) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.displayName = displayName;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.country = country;
        this.profileImageUrl = profileImageUrl;
        this.isVerified = isVerified;
        this.roles = roles;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Set<RoleDTO> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<RoleDTO> roles) {
        this.roles = roles;
    }
    private String bio;
    private String avatarUrl;

    // Add getters and setters
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

    // Update constructor
    public UserResponseDTO(Long id, String email, String username, 
                          String displayName, String phoneNumber, Gender gender, 
                          String country, String profileImageUrl, Boolean isVerified,
                          Set<RoleDTO> roles, String bio, String avatarUrl) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.displayName = displayName;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.country = country;
        this.profileImageUrl = profileImageUrl;
        this.isVerified = isVerified;
        this.roles = roles;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

}

