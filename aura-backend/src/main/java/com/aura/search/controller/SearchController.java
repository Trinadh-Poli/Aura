package com.aura.search.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aura.artist.entity.Album;
import com.aura.artist.entity.Artist;
import com.aura.artist.entity.Song;
import com.aura.search.service.SearchService;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> searchAll(@RequestParam String query) {
        Map<String, Object> results = new HashMap<>();
        results.put("songs", searchService.searchSongs(query));
        results.put("albums", searchService.searchAlbums(query));
        results.put("artists", searchService.searchArtists(query));
        return ResponseEntity.ok(results);
    }

    @GetMapping("/songs")
    public ResponseEntity<List<Map<String, Object>>> searchSongs(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchSongs(query));
    }

    @GetMapping("/albums")
    public ResponseEntity<List<Album>> searchAlbums(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchAlbums(query));
    }

    @GetMapping("/artists")
    public ResponseEntity<List<Artist>> searchArtists(@RequestParam String query) {
        return ResponseEntity.ok(searchService.searchArtists(query));
    }

    @GetMapping("/by-genre")
    public ResponseEntity<List<Song>> searchByGenre(@RequestParam String genre) {
        return ResponseEntity.ok(searchService.searchByGenre(genre));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Map<String, Object>>> getTrendingSongs() {
        return ResponseEntity.ok(searchService.getTrendingSongs());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentSongs() {
        return ResponseEntity.ok(searchService.getRecentSongs());
    }
}
