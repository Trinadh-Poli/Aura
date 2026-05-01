package com.aura.artist.service;

import com.aura.artist.dto.ArtistProfileDTO;
import com.aura.artist.entity.Artist;
import com.aura.artist.repository.ArtistRepository;
import com.aura.user.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArtistService {
    private final ArtistRepository artistRepository;

    public ArtistService(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @Transactional
    public Artist updateProfile(Long userId, ArtistProfileDTO dto) {
        Artist artist = artistRepository.findByUserId(userId);
        if (artist == null) {
            throw new ResourceNotFoundException("Artist not found for userId: " + userId);
        }
        
        if (dto.getStageName() != null) {
            artist.setStageName(dto.getStageName());
        }
        if (dto.getBio() != null) {
            artist.setBio(dto.getBio());
        }
        if (dto.getProfileImageUrl() != null) {
            artist.setProfileImageUrl(dto.getProfileImageUrl());
        }
        if (dto.getHeaderImageUrl() != null) {
            artist.setHeaderImageUrl(dto.getHeaderImageUrl());
        }
        
        return artistRepository.save(artist);
    }

    public Artist getOwnProfile(Long userId) {
        Artist artist = artistRepository.findByUserId(userId);
        if (artist == null) {
            throw new ResourceNotFoundException("Artist not found for userId: " + userId);
        }
        return artist;
    }

    public Artist getPublicProfile(Long artistId) {
        return artistRepository.findById(artistId).orElse(null);
    }
}
