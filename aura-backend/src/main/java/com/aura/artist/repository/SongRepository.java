package com.aura.artist.repository;

import com.aura.artist.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByArtistId(Long artistId);
    List<Song> findByAlbum_AlbumId(Long albumId);
    List<Song> findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(String title, String genre);
    List<Song> findByGenreIgnoreCase(String genre);
    List<Song> findTop20ByOrderBySongIdDesc();

}
