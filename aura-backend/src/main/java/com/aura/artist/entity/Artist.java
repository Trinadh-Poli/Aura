package com.aura.artist.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artists")
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long artistId;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 100, nullable = false)
    private String stageName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 255)
    private String profileImageUrl;

    @Column(length = 255)
    private String headerImageUrl;

    // Getters and setters
    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getStageName() { return stageName; }
    public void setStageName(String stageName) { this.stageName = stageName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public String getHeaderImageUrl() { return headerImageUrl; }
    public void setHeaderImageUrl(String headerImageUrl) { this.headerImageUrl = headerImageUrl; }
}
