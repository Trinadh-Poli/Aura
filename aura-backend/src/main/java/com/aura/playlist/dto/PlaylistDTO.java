package com.aura.playlist.dto;

import com.aura.artist.entity.Song;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class PlaylistDTO {
    private Long playlistId;
    private Long userId;
    private String title;
    private String description;
    private Boolean isPublic;
    private String coverImageUrl;
    private Integer songCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Map<String, Object>> songs;

    public PlaylistDTO() {}

    // Getters and Setters
    public Long getPlaylistId() { return playlistId; }
    public void setPlaylistId(Long playlistId) { this.playlistId = playlistId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Integer getSongCount() { return songCount; }
    public void setSongCount(Integer songCount) { this.songCount = songCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Map<String, Object>> getSongs() { return songs; }
    public void setSongs(List<Map<String, Object>> songs) { this.songs = songs; }
}
