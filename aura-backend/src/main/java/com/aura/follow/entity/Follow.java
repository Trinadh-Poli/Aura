package com.aura.follow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "follows")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long followId;

    @Column(nullable = false)
    private Long followerId;

    @Column(nullable = true)
    private Long followingId;

    @Column(name = "following_artist_id", nullable = true)
    private Long followingArtistId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getFollowId() { return followId; }
    public void setFollowId(Long followId) { this.followId = followId; }

    public Long getFollowerId() { return followerId; }
    public void setFollowerId(Long followerId) { this.followerId = followerId; }

    public Long getFollowingId() { return followingId; }
    public void setFollowingId(Long followingId) { this.followingId = followingId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getFollowingArtistId() { return followingArtistId; }
    public void setFollowingArtistId(Long followingArtistId) { this.followingArtistId = followingArtistId; }
}
