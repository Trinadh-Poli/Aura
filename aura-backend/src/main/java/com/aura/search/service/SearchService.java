package com.aura.search.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aura.artist.entity.Album;
import com.aura.artist.entity.Artist;
import com.aura.artist.entity.Song;
import com.aura.artist.repository.AlbumRepository;
import com.aura.artist.repository.ArtistRepository;
import com.aura.artist.repository.SongRepository;

@Service
public class SearchService {

    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    public SearchService(SongRepository songRepository,
            AlbumRepository albumRepository,
            ArtistRepository artistRepository) {
        this.songRepository = songRepository;
        this.albumRepository = albumRepository;
        this.artistRepository = artistRepository;
    }

    public List<Map<String, Object>> searchSongs(String query) {
        List<Song> songs = songRepository.findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(query, query);
        return songs.stream().map(this::songToMap).collect(Collectors.toList());
    }

    public List<Album> searchAlbums(String query) {
        return albumRepository.findByTitleContainingIgnoreCase(query);
    }

    public List<Artist> searchArtists(String query) {
        return artistRepository.findByStageNameContainingIgnoreCase(query);
    }

    public List<Song> searchByGenre(String genre) {
        return songRepository.findByGenreIgnoreCase(genre);
    }

    public List<Map<String, Object>> getTrendingSongs() {
        return songRepository.findAll().stream().map(this::songToMap).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getRecentSongs() {
        return songRepository.findTop20ByOrderBySongIdDesc().stream()
                .map(this::songToMap).collect(Collectors.toList());
    }

    private Map<String, Object> songToMap(Song song) {
        Map<String, Object> map = new HashMap<>();
        map.put("songId", song.getSongId());
        map.put("title", song.getTitle());
        map.put("artistId", song.getArtistId());
        map.put("genre", song.getGenre());
        map.put("duration", song.getDuration());
        map.put("filePath", song.getFilePath());
        map.put("albumId", song.getAlbumId());

        // Fetch artist name
        Artist artist = artistRepository.findById(song.getArtistId()).orElse(null);
        map.put("artistName", artist != null ? artist.getStageName() : "Unknown Artist");

        return map;
    }
}
