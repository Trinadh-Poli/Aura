package com.aura.follow.dto;

import com.fasterxml.jackson.annotation.JsonProperty;


public class UserFollowStatsDTO {
    private Long userId;
    private String username;
    private Integer followersCount;
    private Integer followingCount;
    private Boolean isFollowing;
    private String displayName;
    private String profileImageUrl;
    @JsonProperty("isArtist")
    private Boolean isArtist;

    public UserFollowStatsDTO() {}

    public UserFollowStatsDTO(Long userId, String username, Integer followersCount, 
                              Integer followingCount, Boolean isFollowing, 
                              String displayName, String profileImageUrl, Boolean isArtist) {
        this.userId = userId;
        this.username = username;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.isFollowing = isFollowing;
        this.displayName = displayName;
        this.profileImageUrl = profileImageUrl;
        this.isArtist = isArtist;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Integer getFollowersCount() { return followersCount; }
    public void setFollowersCount(Integer followersCount) { this.followersCount = followersCount; }

    public Integer getFollowingCount() { return followingCount; }
    public void setFollowingCount(Integer followingCount) { this.followingCount = followingCount; }

    public Boolean getIsFollowing() { return isFollowing; }
    public void setIsFollowing(Boolean isFollowing) { this.isFollowing = isFollowing; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public Boolean getIsArtist() { return isArtist; }
    public void setIsArtist(Boolean isArtist) { this.isArtist = isArtist; }
}
