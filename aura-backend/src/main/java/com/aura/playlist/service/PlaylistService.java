package com.aura.playlist.service;

import com.aura.artist.entity.Song;
import com.aura.artist.repository.SongRepository;
import com.aura.playlist.dto.PlaylistCreateDTO;
import com.aura.playlist.dto.PlaylistDTO;
import com.aura.playlist.entity.Playlist;
import com.aura.playlist.repository.PlaylistRepository;
import com.aura.user.entity.User;
import com.aura.user.exception.ResourceNotFoundException; 
import com.aura.user.exception.UnauthorizedException; 
import com.aura.user.repository.UserRepository; 
import org.hibernate.Hibernate; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final com.aura.artist.repository.ArtistRepository artistRepository;

    public PlaylistService(PlaylistRepository playlistRepository, SongRepository songRepository,
                           UserRepository userRepository, com.aura.artist.repository.ArtistRepository artistRepository) {
        this.playlistRepository = playlistRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
        this.artistRepository = artistRepository;
    }
    
    // FIX: Helper to resolve ID from the authenticated principal's email
    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"))
            .getId();
    }
    
    // FIX: Accepts userEmail instead of userId
    @Transactional
    public PlaylistDTO createPlaylist(String userEmail, PlaylistCreateDTO dto) {
        Long userId = getUserIdFromEmail(userEmail); // Resolve ID securely
        
        Playlist playlist = new Playlist();
        playlist.setUserId(userId);
        playlist.setTitle(dto.getTitle());
        playlist.setDescription(dto.getDescription());
        playlist.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : false);
        playlist.setCreatedAt(LocalDateTime.now());
        playlist.setUpdatedAt(LocalDateTime.now());

        Playlist saved = playlistRepository.save(playlist);
        return convertToDTO(saved);
    }
    
    // FIX: Added viewerEmail parameter for privacy check
    @Transactional(readOnly = true)
    public List<PlaylistDTO> getUserPlaylists(Long userId, String viewerEmail) {
        // If viewer is the owner, return all playlists (private and public)
        if (viewerEmail != null) {
            Long viewerId = userRepository.findByEmail(viewerEmail).map(User::getId).orElse(null);
            if (viewerId != null && viewerId.equals(userId)) {
                List<Playlist> playlists = playlistRepository.findByUserId(userId);
                return playlists.stream().map(this::convertToDTO).toList();
            }
        }
        
        // Otherwise, return only public playlists
        return getPublicPlaylists(userId);
    }
    
    // Kept as is
    @Transactional(readOnly = true)
    public List<PlaylistDTO> getPublicPlaylists(Long userId) {
        List<Playlist> playlists = playlistRepository.findByUserIdAndIsPublicTrue(userId);
        return playlists.stream().map(this::convertToDTO).toList();
    }

    // Kept as is
    @Transactional(readOnly = true)
    public List<PlaylistDTO> searchPlaylists(String query) {
        List<Playlist> playlists = playlistRepository.findByTitleContainingIgnoreCaseAndIsPublicTrue(query);
        // Note: convertToDTO won't trigger lazy loading because it checks isInitialized
        return playlists.stream().map(this::convertToDTO).toList();
    }
    
    // FIX: New method for authenticated owner access, handles Lazy loading
    @Transactional(readOnly = true)
    public PlaylistDTO getPlaylistForOwner(Long playlistId, String userEmail) {
        Long userId = getUserIdFromEmail(userEmail);
        
        Playlist playlist = playlistRepository.findByPlaylistIdAndUserId(playlistId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found or access denied")); 
        
        return convertToDTO(playlist);
    }

    // FIX: Handles Lazy loading and uses custom exceptions
    @Transactional(readOnly = true)
    public PlaylistDTO getPublicPlaylist(Long playlistId) {
        Playlist playlist = playlistRepository.findWithSongsByPlaylistId(playlistId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
        
        if (!playlist.getIsPublic()) {
            throw new UnauthorizedException("Playlist is not public"); 
        }
        
        return convertToDTO(playlist);
    }

    // FIX: Accepts userEmail instead of userId
    @Transactional
    public PlaylistDTO updatePlaylist(Long playlistId, String userEmail, PlaylistCreateDTO dto) {
        Long userId = getUserIdFromEmail(userEmail);
        
        Playlist playlist = playlistRepository.findByPlaylistIdAndUserId(playlistId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found or access denied"));
        
        playlist.setTitle(dto.getTitle());
        playlist.setDescription(dto.getDescription());
        playlist.setIsPublic(dto.getIsPublic() != null ? dto.getIsPublic() : playlist.getIsPublic());
        playlist.setUpdatedAt(LocalDateTime.now());

        Playlist updated = playlistRepository.save(playlist);
        return convertToDTO(updated);
    }

    // FIX: Accepts userEmail instead of userId
    @Transactional
    public void deletePlaylist(Long playlistId, String userEmail) {
        Long userId = getUserIdFromEmail(userEmail);
        
        Playlist playlist = playlistRepository.findByPlaylistIdAndUserId(playlistId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found or access denied"));
        
        playlistRepository.delete(playlist);
    }

    // FIX: Accepts userEmail instead of userId and uses custom exceptions
    @Transactional
    public PlaylistDTO addSongToPlaylist(Long playlistId, Long songId, String userEmail) {
        Long userId = getUserIdFromEmail(userEmail);
        
        Playlist playlist = playlistRepository.findByPlaylistIdAndUserId(playlistId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found or access denied"));
        
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found")); 
        
        if (!playlist.getSongs().contains(song)) {
            playlist.getSongs().add(song);
            playlist.setUpdatedAt(LocalDateTime.now());
            playlistRepository.save(playlist);
        }
        
        return convertToDTO(playlist);
    }

    // FIX: Accepts userEmail instead of userId and uses custom exceptions
    @Transactional
    public PlaylistDTO removeSongFromPlaylist(Long playlistId, Long songId, String userEmail) {
        Long userId = getUserIdFromEmail(userEmail);
        
        Playlist playlist = playlistRepository.findByPlaylistIdAndUserId(playlistId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found or access denied"));
        
        Song song = songRepository.findById(songId)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found")); 
        
        playlist.getSongs().remove(song);
        playlist.setUpdatedAt(LocalDateTime.now());
        playlistRepository.save(playlist);
        
        return convertToDTO(playlist);
    }

    // FIX: Accepts userEmail instead of userId and handles Lazy loading
    public List<Song> getPlaylistSongs(Long playlistId, String userEmail) {
        Long userId = getUserIdFromEmail(userEmail);
        
        Playlist playlist = playlistRepository.findByPlaylistIdAndUserId(playlistId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Playlist not found or access denied"));
        
        return playlist.getSongs();
    }

    private PlaylistDTO convertToDTO(Playlist playlist) {
        PlaylistDTO dto = new PlaylistDTO();
        dto.setPlaylistId(playlist.getPlaylistId());
        dto.setUserId(playlist.getUserId());
        dto.setTitle(playlist.getTitle());
        dto.setDescription(playlist.getDescription());
        dto.setIsPublic(playlist.getIsPublic());
        dto.setCoverImageUrl(playlist.getCoverImageUrl());
        
        // FIX: Only try to get size if songs are initialized (prevents Lazy load errors)
        if (org.hibernate.Hibernate.isInitialized(playlist.getSongs())) {
             dto.setSongCount(playlist.getSongs().size());
             
             List<Long> artistIds = playlist.getSongs().stream()
                 .map(Song::getArtistId)
                 .distinct()
                 .collect(Collectors.toList());
                 
             java.util.Map<Long, String> artistNameMap = artistRepository.findAllById(artistIds).stream()
                 .collect(Collectors.toMap(com.aura.artist.entity.Artist::getArtistId, com.aura.artist.entity.Artist::getStageName));

             List<java.util.Map<String, Object>> songMaps = playlist.getSongs().stream().map(song -> {
                 java.util.Map<String, Object> map = new java.util.HashMap<>();
                 map.put("songId", song.getSongId());
                 map.put("title", song.getTitle());
                 map.put("artistId", song.getArtistId());
                 map.put("genre", song.getGenre());
                 map.put("duration", song.getDuration());
                 map.put("filePath", song.getFilePath());
                 map.put("albumId", song.getAlbumId());
                 
                 map.put("artistName", artistNameMap.getOrDefault(song.getArtistId(), "Unknown Artist"));
                 return map;
             }).collect(Collectors.toList());
             dto.setSongs(songMaps);
        } else {
            dto.setSongCount(0); 
            dto.setSongs(null);
        }

        dto.setCreatedAt(playlist.getCreatedAt());
        dto.setUpdatedAt(playlist.getUpdatedAt());
        
        return dto;
    }
}