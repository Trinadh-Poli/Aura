package com.aura.artist.repository;

import com.aura.artist.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByArtistId(Long artistId);
    List<Album> findByTitleContainingIgnoreCase(String title);
}
