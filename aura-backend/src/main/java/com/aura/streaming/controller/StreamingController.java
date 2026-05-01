package com.aura.streaming.controller;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aura.artist.entity.Song;
import com.aura.artist.service.SongService;

@RestController
@RequestMapping("/api/stream")
public class StreamingController {

    @Value("${app.music.storage-path}")
    private String storagePath;

    private final SongService songService;

    public StreamingController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("/song/{songId}")
    public ResponseEntity<Resource> streamSong(@PathVariable Long songId) {
        try {
            Song song = songService.getSong(songId);
            if (song == null) {
                return ResponseEntity.notFound().build();
            }

            // Combine storage path with filename
            Path path = Paths.get(storagePath, song.getFilePath());

            // Validate path
            Path basePath = Paths.get(storagePath).toAbsolutePath().normalize();
            Path resolvedPath = path.toAbsolutePath().normalize();
            if (!resolvedPath.startsWith(basePath)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/song/{songId}/download")
    public ResponseEntity<Resource> downloadSong(@PathVariable Long songId) {
        try {
            Song song = songService.getSong(songId);
            if (song == null) {
                return ResponseEntity.notFound().build();
            }

            // Combine storage path with filename
            Path path = Paths.get(storagePath, song.getFilePath());

            // Validate path
            Path basePath = Paths.get(storagePath).toAbsolutePath().normalize();
            Path resolvedPath = path.toAbsolutePath().normalize();
            if (!resolvedPath.startsWith(basePath)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/mpeg"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + song.getTitle() + ".mp3\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
