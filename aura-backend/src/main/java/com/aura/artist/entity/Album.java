package com.aura.artist.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "albums")
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long albumId;

    @Column(nullable = false)
    private Long artistId;

    @Column(length = 150, nullable = false)
    private String title;

    @Column
    private Integer releaseYear;

    @Column(length = 255)
    private String coverImageUrl;

    @Column
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
