package com.aura.artist.controller;

import com.aura.artist.dto.ArtistProfileDTO;
import org.springframework.http.ResponseEntity;

import com.aura.artist.entity.Artist;
import com.aura.artist.service.ArtistService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artist")
public class ArtistController {
    private final ArtistService artistService;
    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PutMapping("/profile")
    public ResponseEntity<Artist> updateProfile(
            @RequestParam Long userId,
            @RequestBody ArtistProfileDTO dto) {
        Artist updatedArtist = artistService.updateProfile(userId, dto);
        return ResponseEntity.ok(updatedArtist);
    }


    @GetMapping("/me")
    public Artist getOwnProfile(@RequestParam Long userId) {
        return artistService.getOwnProfile(userId);
    }

    @GetMapping("/profile/{artistid}")
    public Artist getPublicProfile(@PathVariable("artistid") Long id) {
        return artistService.getPublicProfile(id);
    }
}
