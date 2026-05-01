package com.aura.artist.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AlbumCreateDTO {
    // artistId is required by services/controllers to associate the album with an artist
    private Long artistId;

    @NotBlank
    private String title;

    private Integer releaseYear;

    @NotNull
    private MultipartFile coverImage; // Accept file upload

    // Getters/setters
    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    public MultipartFile getCoverImage() { return coverImage; }
    public void setCoverImage(MultipartFile coverImage) { this.coverImage = coverImage; }
}