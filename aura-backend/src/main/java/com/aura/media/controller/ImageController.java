package com.aura.media.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @GetMapping("/albums/{artistId}/{filename:.+}")
    public ResponseEntity<Resource> getAlbumCover(
            @PathVariable Long artistId,
            @PathVariable String filename) {
        return serveImage("\\uploads\\albums\\" + artistId + "\\" + filename);
    }

    @GetMapping("/covers/{artistId}/{filename:.+}")
    public ResponseEntity<Resource> getSongCover(
            @PathVariable Long artistId,
            @PathVariable String filename) {
        return serveImage("\\uploads\\covers\\" + artistId + "\\" + filename);
    }

    @GetMapping("/profiles/{userId}/{filename:.+}")
    public ResponseEntity<Resource> getProfileImage(
            @PathVariable Long userId,
            @PathVariable String filename) {
        return serveImage("\\uploads\\profiles\\" + userId + "\\" + filename);
    }

    @GetMapping("/artists/{artistId}/profile/{filename:.+}")
    public ResponseEntity<Resource> getArtistProfileImage(
            @PathVariable Long artistId,
            @PathVariable String filename) {
        return serveImage("\\uploads\\artists\\" + artistId + "\\profile\\" + filename);
    }

    @GetMapping("/artists/{artistId}/header/{filename:.+}")
    public ResponseEntity<Resource> getArtistHeaderImage(
            @PathVariable Long artistId,
            @PathVariable String filename) {
        return serveImage("\\uploads\\artists\\" + artistId + "\\header\\" + filename);
    }

    private ResponseEntity<Resource> serveImage(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "image/jpeg";
            if (filePath.endsWith(".png")) contentType = "image/png";
            else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (filePath.endsWith(".gif")) contentType = "image/gif";
            else if (filePath.endsWith(".webp")) contentType = "image/webp";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
