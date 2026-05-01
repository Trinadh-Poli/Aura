package com.aura.artist.service;

import com.aura.artist.dto.AlbumCreateDTO;
import com.aura.artist.dto.AlbumDTO;
import com.aura.artist.entity.Album;
import com.aura.artist.repository.AlbumRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    @Transactional
    public AlbumDTO createAlbum(AlbumCreateDTO dto) throws IOException {
        String uploadFolder = "/uploads/albums/" + dto.getArtistId() + "/";
        Files.createDirectories(Paths.get(uploadFolder));
        
        String originalFilename = dto.getCoverImage().getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String coverFileName = UUID.randomUUID().toString() + extension;
        
        Path coverPath = Paths.get(uploadFolder, coverFileName);
        Files.write(coverPath, dto.getCoverImage().getBytes());

        Album album = new Album();
        album.setArtistId(dto.getArtistId());
        album.setTitle(dto.getTitle());
        album.setReleaseYear(dto.getReleaseYear());
        album.setCoverImageUrl(coverPath.toString());
        album.setTotalTracks(0);

        Album savedAlbum = albumRepository.save(album);
        return toDTO(savedAlbum);
    }

    public List<AlbumDTO> getAlbumsByArtist(Long artistId) {
        List<Album> albums = albumRepository.findByArtistId(artistId);
        return albums.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AlbumDTO getAlbum(Long albumId) {
        Album album = albumRepository.findById(albumId).orElse(null);
        return album != null ? toDTO(album) : null;
    }

    @Transactional
    public AlbumDTO updateAlbum(Long albumId, AlbumCreateDTO dto) throws IOException {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found"));
        album.setTitle(dto.getTitle());
        album.setReleaseYear(dto.getReleaseYear());
        if (dto.getCoverImage() != null) {
            String uploadFolder = "/uploads/albums/" + album.getArtistId() + "/";
            Files.createDirectories(Paths.get(uploadFolder));
            
            String originalFilename = dto.getCoverImage().getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String coverFileName = UUID.randomUUID().toString() + extension;
            
            Path coverPath = Paths.get(uploadFolder, coverFileName);
            Files.write(coverPath, dto.getCoverImage().getBytes());
            album.setCoverImageUrl(coverPath.toString());
        }
        albumRepository.save(album);
        return toDTO(album);
    }

    @Transactional
    public void deleteAlbum(Long albumId) throws IOException {
        Album album = albumRepository.findById(albumId).orElse(null);
        if (album != null && album.getCoverImageUrl() != null) {
            Files.deleteIfExists(Paths.get(album.getCoverImageUrl()));
        }
        albumRepository.deleteById(albumId);
    }

    // Album -> AlbumDTO mapper
    private AlbumDTO toDTO(Album album) {
        AlbumDTO dto = new AlbumDTO();
        dto.setAlbumId(album.getAlbumId());
        dto.setArtistId(album.getArtistId());
        dto.setTitle(album.getTitle());
        dto.setReleaseYear(album.getReleaseYear());
        dto.setCoverImageUrl(album.getCoverImageUrl());
        dto.setTotalTracks(album.getTotalTracks());
        return dto;
    }
}
