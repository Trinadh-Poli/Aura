package com.aura.artist.repository;

import com.aura.artist.entity.Artist;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Artist findByUserId(Long userId);
    List<Artist> findByStageNameContainingIgnoreCase(String stageName);
}
