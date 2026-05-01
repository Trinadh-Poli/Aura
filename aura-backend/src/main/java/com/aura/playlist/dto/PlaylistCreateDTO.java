package com.aura.playlist.dto;

public class PlaylistCreateDTO {
    private String title;
    private String description;
    private Boolean isPublic;

    public PlaylistCreateDTO() {}

    public PlaylistCreateDTO(String title, String description, Boolean isPublic) {
        this.title = title;
        this.description = description;
        this.isPublic = isPublic;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
}
