package com.aura.playlist.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aura.artist.entity.Song;
import com.aura.playlist.dto.PlaylistCreateDTO;
import com.aura.playlist.dto.PlaylistDTO;
import com.aura.playlist.service.PlaylistService;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    // FIX: userId derived securely from JWT token (AuthenticationPrincipal)
    // ✅ CREATE PLAYLIST
    @PostMapping
    public ResponseEntity<PlaylistDTO> createPlaylist(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody PlaylistCreateDTO dto) {
        
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(playlistService.createPlaylist(userEmail, dto));
    }

    // FIX: Added viewerPrincipal for privacy check
    // ✅ GET USER'S PLAYLISTS (Can be public/private, service handles logic)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PlaylistDTO>> getUserPlaylists(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails principal) {
        
        String viewerEmail = principal != null ? principal.getUsername() : null;
        return ResponseEntity.ok(playlistService.getUserPlaylists(userId, viewerEmail));
    }

    // ✅ GET PUBLIC PLAYLISTS BY USER (Kept as is)
    @GetMapping("/user/{userId}/public")
    public ResponseEntity<List<PlaylistDTO>> getPublicPlaylists(@PathVariable Long userId) {
        return ResponseEntity.ok(playlistService.getPublicPlaylists(userId));
    }

    // ✅ SEARCH PLAYLISTS (Kept as is)
    @GetMapping("/search")
    public ResponseEntity<List<PlaylistDTO>> searchPlaylists(@RequestParam String query) {
        return ResponseEntity.ok(playlistService.searchPlaylists(query));
    }

    // FIX: Owner ID derived securely from JWT token.
    // ✅ GET SINGLE PLAYLIST (PRIVATE - OWNER ONLY)
    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDTO> getPlaylist(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal UserDetails principal) {

        String userEmail = principal.getUsername();
        return ResponseEntity.ok(playlistService.getPlaylistForOwner(playlistId, userEmail));
    }
    
    // ✅ GET PUBLIC PLAYLIST (Kept as is)
    @GetMapping("/public/{playlistId}")
    public ResponseEntity<PlaylistDTO> getPublicPlaylist(@PathVariable Long playlistId) {
        return ResponseEntity.ok(playlistService.getPublicPlaylist(playlistId));
    }

    // FIX: Owner ID derived securely from JWT token.
    // ✅ UPDATE PLAYLIST
    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistDTO> updatePlaylist(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody PlaylistCreateDTO dto) {
        
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(playlistService.updatePlaylist(playlistId, userEmail, dto));
    }

    // FIX: Owner ID derived securely from JWT token.
    // ✅ DELETE PLAYLIST
    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Void> deletePlaylist(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal UserDetails principal) {
        
        String userEmail = principal.getUsername();
        playlistService.deletePlaylist(playlistId, userEmail);
        return ResponseEntity.noContent().build();
    }

    // FIX: Owner ID derived securely from JWT token.
    // ✅ ADD SONG TO PLAYLIST
    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDTO> addSongToPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId,
            @AuthenticationPrincipal UserDetails principal) {
        
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(playlistService.addSongToPlaylist(playlistId, songId, userEmail));
    }

    // FIX: Owner ID derived securely from JWT token.
    // ✅ REMOVE SONG FROM PLAYLIST
    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDTO> removeSongFromPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId,
            @AuthenticationPrincipal UserDetails principal) {
        
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(playlistService.removeSongFromPlaylist(playlistId, songId, userEmail));
    }

    // FIX: Owner ID derived securely from JWT token.
    // ✅ GET PLAYLIST SONGS
    @GetMapping("/{playlistId}/songs")
    public ResponseEntity<List<Song>> getPlaylistSongs(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal UserDetails principal) {
        
        String userEmail = principal.getUsername();
        return ResponseEntity.ok(playlistService.getPlaylistSongs(playlistId, userEmail));
    }
}