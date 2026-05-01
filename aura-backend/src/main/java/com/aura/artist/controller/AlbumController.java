package com.aura.artist.controller;

import com.aura.artist.dto.AlbumCreateDTO;
import com.aura.artist.dto.AlbumDTO;
import com.aura.artist.service.AlbumService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/artist/albums")
public class AlbumController {

    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }

    @PostMapping
    public AlbumDTO createAlbum(@ModelAttribute AlbumCreateDTO dto) throws IOException {
        return albumService.createAlbum(dto);
    }

    @GetMapping("/artist/{artistId}")
    public List<AlbumDTO> getAlbumsByArtist(@PathVariable Long artistId) {
        return albumService.getAlbumsByArtist(artistId);
    }

    @GetMapping("/{albumId}")
    public AlbumDTO getAlbum(@PathVariable Long albumId) {
        return albumService.getAlbum(albumId);
    }

    @PutMapping("/{albumId}")
    public AlbumDTO updateAlbum(@PathVariable Long albumId, @ModelAttribute AlbumCreateDTO dto) throws IOException {
        return albumService.updateAlbum(albumId, dto);
    }

    @DeleteMapping("/{albumId}")
    public void deleteAlbum(@PathVariable Long albumId) throws IOException {
        albumService.deleteAlbum(albumId);
    }
}
