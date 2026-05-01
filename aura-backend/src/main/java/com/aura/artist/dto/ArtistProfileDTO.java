package com.aura.artist.dto;

import jakarta.validation.constraints.NotBlank;

public class ArtistProfileDTO {
    @NotBlank
    private String stageName;

    private String bio;
    private String profileImageUrl;
    private String headerImageUrl;

    // Getters and setters
    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public String getHeaderImageUrl() { return headerImageUrl; }
    public void setHeaderImageUrl(String headerImageUrl) { this.headerImageUrl = headerImageUrl; }
}
