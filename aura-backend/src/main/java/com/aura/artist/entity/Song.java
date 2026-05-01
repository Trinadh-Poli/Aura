package com.aura.artist.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "songs")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long songId;

    @Column(nullable = false)
    private Long artistId;

    @Column(length = 150, nullable = false)
    private String title;

    @Column(length = 50)
    private String genre;

    @Column
    private Integer duration; // duration in seconds

    @Column(length = 255, nullable = false)
    private String filePath;

    @Column(length = 255)
    private String coverImageUrl;

    // ✅ RELATIONSHIP TO ALBUM (NOT a string column)
    // FIX: Changed to LAZY fetch type for performance.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Album album;

    // Getters and setters
    public Long getSongId() {
        return songId;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public Long getArtistId() {
        return artistId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public Album getAlbum() {
        return album;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }

    // Helper method to get albumId
    public Long getAlbumId() {
        return album != null ? album.getAlbumId() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Song)) return false;
        Song song = (Song) o;
        Long thisId = getSongId();
        Long thatId = song.getSongId();
        return thisId != null && thisId.equals(thatId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}