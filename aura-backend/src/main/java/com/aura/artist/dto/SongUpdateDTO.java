package com.aura.artist.dto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class SongUpdateDTO {
    @NotBlank
    private String title;
    private String album;
    private String genre;
    private Integer duration;
    private MultipartFile songFile;
    private MultipartFile coverImage;
    private Long albumId;
    public Long getAlbumId() { return albumId; }
    public void setAlbumId(Long albumId) { this.albumId = albumId; }


    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public MultipartFile getSongFile() { return songFile; }
    public void setSongFile(MultipartFile songFile) { this.songFile = songFile; }
    public MultipartFile getCoverImage() { return coverImage; }
    public void setCoverImage(MultipartFile coverImage) { this.coverImage = coverImage; }
}
