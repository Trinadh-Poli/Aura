package com.aura.artist.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aura.artist.dto.SongUpdateDTO;
import com.aura.artist.dto.SongUploadDTO;
import com.aura.artist.entity.Song;
import com.aura.artist.service.SongService;

@RestController
@RequestMapping("/api/artist/songs")
public class SongController {
    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    // ✅ PUT THIS FIRST (Most specific)
    @GetMapping("/{artistId}/my-songs")
    public ResponseEntity<List<Song>> getMySongs(@PathVariable Long artistId) {
        System.out.println("getMySongs called with artistId: " + artistId);  // Debug log
        return ResponseEntity.ok(songService.getMySongs(artistId));
    }

    // ✅ Then other path-based routes
    @PostMapping("/album/{albumId}")
    public ResponseEntity<Song> uploadSongToAlbum(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal,
            @PathVariable Long albumId,
            @ModelAttribute SongUploadDTO dto) throws Exception {
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(songService.uploadSong(userEmail, albumId, dto));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Song>> getArtistSongs(@PathVariable Long artistId) {
        return ResponseEntity.ok(songService.getMySongs(artistId));
    }

    @GetMapping("/album/{albumId}")
    public ResponseEntity<List<Song>> getSongsByAlbum(@PathVariable Long albumId) {
        return ResponseEntity.ok(songService.getSongsByAlbum(albumId));
    }

    // ✅ PUT THIS LAST (Most generic)
    @GetMapping("/{songId}")
    public ResponseEntity<Song> getSong(@PathVariable Long songId) {
        Song song = songService.getSong(songId);
        if (song == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(song);
    }

    @PutMapping("/{songId}")
    public ResponseEntity<Song> updateSong(
            @PathVariable Long songId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal,
            @ModelAttribute SongUpdateDTO dto) throws Exception {
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(songService.updateSong(songId, userEmail, dto));
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long songId,
                                           @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails principal) throws Exception {
        String userEmail = principal.getUsername();
        songService.deleteSong(songId, userEmail);
        return ResponseEntity.noContent().build();
    }
}
