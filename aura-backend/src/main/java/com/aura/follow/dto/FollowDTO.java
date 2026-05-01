package com.aura.follow.dto;

import java.time.LocalDateTime;

public class FollowDTO {
    private Long followId;
    private Long followerId;
    private Long followingId;
    private Long followingArtistId;
    private String followerName;
    private String followingName;
    private LocalDateTime createdAt;

    public FollowDTO() {}

    public FollowDTO(Long followerId, Long followingId, Long followingArtistId, String followerName, String followingName) {
        this.followerId = followerId;
        this.followingId = followingId;
        this.followingArtistId = followingArtistId;
        this.followerName = followerName;
        this.followingName = followingName;
    }

    public Long getFollowId() { return followId; }
    public void setFollowId(Long followId) { this.followId = followId; }

    public Long getFollowerId() { return followerId; }
    public void setFollowerId(Long followerId) { this.followerId = followerId; }

    public Long getFollowingId() { return followingId; }
    public void setFollowingId(Long followingId) { this.followingId = followingId; }

    public Long getFollowingArtistId() { return followingArtistId; }
    public void setFollowingArtistId(Long followingArtistId) { this.followingArtistId = followingArtistId; }

    public String getFollowerName() { return followerName; }
    public void setFollowerName(String followerName) { this.followerName = followerName; }

    public String getFollowingName() { return followingName; }
    public void setFollowingName(String followingName) { this.followingName = followingName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
