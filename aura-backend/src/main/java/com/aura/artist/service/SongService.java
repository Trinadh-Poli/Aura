package com.aura.artist.service;

import com.aura.artist.dto.SongUploadDTO;
import com.aura.artist.dto.SongUpdateDTO;
import com.aura.artist.entity.Song;
import com.aura.artist.entity.Album;
import com.aura.artist.repository.SongRepository;
import com.aura.artist.repository.AlbumRepository;
import com.aura.user.exception.ResourceNotFoundException;
import com.aura.user.exception.UnauthorizedException; 
import com.aura.user.repository.UserRepository; 
import com.aura.user.entity.User; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class SongService {
    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final UserRepository userRepository; 
    
    @Value("${app.upload.dir:/uploads}")
    private String uploadBaseDir; 

    public SongService(SongRepository songRepository, AlbumRepository albumRepository, UserRepository userRepository) { 
        this.songRepository = songRepository;
        this.albumRepository = albumRepository;
        this.userRepository = userRepository;
    }

    // FIX: Helper to resolve ID and check for ARTIST role
    private Long getArtistIdFromEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        
        return user.getId();
    }
    
    // FIX: Upload accepts userEmail and uses secure file logic
    @Transactional
    public Song uploadSong(String userEmail, Long albumId, SongUploadDTO dto) throws IOException {
        Long artistId = getArtistIdFromEmail(userEmail); 
        
        // SECURITY/AUTHORIZATION: Verify the artist owns the album before uploading
        Album album = albumRepository.findById(albumId)
            .orElseThrow(() -> new ResourceNotFoundException("Album not found with id: " + albumId));
        
        if (!album.getArtistId().equals(artistId)) {
            throw new UnauthorizedException("You do not have permission to upload to this album.");
        }

        // --- File Handling FIX: Use UUIDs for safety and check extensions ---
        String originalSongFilename = StringUtils.cleanPath(dto.getSongFile().getOriginalFilename());
        String originalCoverFilename = StringUtils.cleanPath(dto.getCoverImage().getOriginalFilename());
        
        String songExtension = originalSongFilename.contains(".") ? originalSongFilename.substring(originalSongFilename.lastIndexOf(".")) : "";
        String coverExtension = originalCoverFilename.contains(".") ? originalCoverFilename.substring(originalCoverFilename.lastIndexOf(".")) : "";

        String uniqueSongFilename = UUID.randomUUID().toString() + songExtension;
        String uniqueCoverFilename = UUID.randomUUID().toString() + coverExtension;

        Path songUploadPath = Paths.get(uploadBaseDir, "songs", artistId.toString());
        Path coverUploadPath = Paths.get(uploadBaseDir, "covers", artistId.toString());
        
        Path finalSongPath = songUploadPath.resolve(uniqueSongFilename);
        Path finalCoverPath = coverUploadPath.resolve(uniqueCoverFilename);

        Files.createDirectories(songUploadPath);
        Files.write(finalSongPath, dto.getSongFile().getBytes());

        Files.createDirectories(coverUploadPath);
        Files.write(finalCoverPath, dto.getCoverImage().getBytes());
        
        String dbSongPath = "/uploads/songs/" + artistId + "/" + uniqueSongFilename;
        String dbCoverPath = "/uploads/covers/" + artistId + "/" + uniqueCoverFilename;


        Song song = new Song();
        song.setArtistId(artistId);
        song.setAlbum(album);
        song.setTitle(dto.getTitle());
        song.setGenre(dto.getGenre());
        song.setDuration(dto.getDuration());
        song.setFilePath(dbSongPath);
        song.setCoverImageUrl(dbCoverPath);
        
        Song savedSong = songRepository.save(song);
        
        album.setTotalTracks(album.getTotalTracks() == null ? 1 : album.getTotalTracks() + 1);
        albumRepository.save(album);
        
        return savedSong;
    }


    public List<Song> getMySongs(Long artistId) {
        return songRepository.findByArtistId(artistId);
    }

    public Song getSong(Long songId) {
        // FIX: Use custom exception
        return songRepository.findById(songId)
            .orElseThrow(() -> new ResourceNotFoundException("Song not found with ID: " + songId));
    }
    
    // FIX: Accepts userEmail for authorization check
    @Transactional
    public Song updateSong(Long songId, String userEmail, SongUpdateDTO dto) throws IOException {
        Long artistId = getArtistIdFromEmail(userEmail); 
        Song song = getSong(songId);
        
        // SECURITY/AUTHORIZATION: Verify the artist owns the song
        if (!song.getArtistId().equals(artistId)) {
            throw new UnauthorizedException("You do not have permission to update this song.");
        }
        
        song.setTitle(dto.getTitle());
        song.setGenre(dto.getGenre());
        song.setDuration(dto.getDuration());
        
        // --- File Handling FIX: Use UUIDs and delete old files ---
        if (dto.getSongFile() != null) {
            String originalFilename = StringUtils.cleanPath(dto.getSongFile().getOriginalFilename());
            String extension = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            Path songUploadPath = Paths.get(uploadBaseDir, "songs", song.getArtistId().toString());
            Path finalSongPath = songUploadPath.resolve(uniqueFilename);
            
            Files.createDirectories(songUploadPath);
            Files.write(finalSongPath, dto.getSongFile().getBytes());
            
            Files.deleteIfExists(Paths.get(uploadBaseDir + song.getFilePath().replace("/uploads", ""))); 

            String dbSongPath = "/uploads/songs/" + song.getArtistId() + "/" + uniqueFilename;
            song.setFilePath(dbSongPath);
        }
        
        if (dto.getCoverImage() != null) {
            String originalFilename = StringUtils.cleanPath(dto.getCoverImage().getOriginalFilename());
            String extension = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            Path coverUploadPath = Paths.get(uploadBaseDir, "covers", song.getArtistId().toString());
            Path finalCoverPath = coverUploadPath.resolve(uniqueFilename);
            
            Files.createDirectories(coverUploadPath);
            Files.write(finalCoverPath, dto.getCoverImage().getBytes());
            
            Files.deleteIfExists(Paths.get(uploadBaseDir + song.getCoverImageUrl().replace("/uploads", ""))); 

            String dbCoverPath = "/uploads/covers/" + song.getArtistId() + "/" + uniqueFilename;
            song.setCoverImageUrl(dbCoverPath);
        }
        return songRepository.save(song);
    }

    // FIX: Accepts userEmail for authorization check
    @Transactional
    public void deleteSong(Long songId, String userEmail) throws IOException {
        Long artistId = getArtistIdFromEmail(userEmail); 
        Song song = getSong(songId);
        
        // SECURITY/AUTHORIZATION: Verify the artist owns the song
        if (!song.getArtistId().equals(artistId)) {
            throw new UnauthorizedException("You do not have permission to delete this song.");
        }
        
        // --- Deletion Logic ---
        Album album = song.getAlbum();
        if (album != null && album.getTotalTracks() != null && album.getTotalTracks() > 0) {
            album.setTotalTracks(album.getTotalTracks() - 1);
            albumRepository.save(album);
        }
        
        // FIX: Use uploadBaseDir for safe file deletion
        Files.deleteIfExists(Paths.get(uploadBaseDir + song.getFilePath().replace("/uploads", "")));
        Files.deleteIfExists(Paths.get(uploadBaseDir + song.getCoverImageUrl().replace("/uploads", "")));
        
        songRepository.delete(song);
    }

    
    public List<Song> getSongsByAlbum(Long albumId) {
        return songRepository.findByAlbum_AlbumId(albumId);
    }
}