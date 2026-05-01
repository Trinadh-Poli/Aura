package com.aura.playlist.repository;

import com.aura.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    
    @EntityGraph(attributePaths = {"songs"})
    List<Playlist> findByUserId(Long userId);
    
    @EntityGraph(attributePaths = {"songs"})
    List<Playlist> findByUserIdAndIsPublicTrue(Long userId);
    
    @EntityGraph(attributePaths = {"songs"})
    List<Playlist> findByTitleContainingIgnoreCaseAndIsPublicTrue(String title);
    
    @EntityGraph(attributePaths = {"songs"})
    Optional<Playlist> findByPlaylistIdAndUserId(Long playlistId, Long userId);

    @EntityGraph(attributePaths = {"songs"})
    Optional<Playlist> findWithSongsByPlaylistId(Long playlistId);
}
