package com.aura.artist.dto;

public class AlbumDTO {
    private Long albumId;
    private Long artistId;
    private String title;
    private Integer releaseYear;
    private String coverImageUrl;
    private Integer totalTracks;

    // Getters and setters
    public Long getAlbumId() { return albumId; }
    public void setAlbumId(Long albumId) { this.albumId = albumId; }
    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Integer getTotalTracks() { return totalTracks; }
    public void setTotalTracks(Integer totalTracks) { this.totalTracks = totalTracks; }
}
