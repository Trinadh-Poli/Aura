package com.aura.follow.service;

import com.aura.artist.entity.Artist;
import com.aura.artist.repository.ArtistRepository;
import com.aura.follow.dto.FollowDTO;
import com.aura.follow.dto.UserFollowStatsDTO;
import com.aura.follow.entity.Follow;
import com.aura.follow.repository.FollowRepository;
import com.aura.user.entity.User;
import com.aura.user.exception.DuplicateResourceException;
import com.aura.user.exception.ResourceNotFoundException;
import com.aura.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;

    public FollowService(FollowRepository followRepository, UserRepository userRepository,
                        ArtistRepository artistRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.artistRepository = artistRepository;
    }

    private User resolveUserByEmail(String email) {
        if (email == null) return null;
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @Transactional
    public FollowDTO followUser(String followerEmail, Long followingId) {
        User follower = resolveUserByEmail(followerEmail);
        Long followerId = follower.getId();

        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        User following = userRepository.findById(followingId)
            .orElseThrow(() -> new ResourceNotFoundException("User to follow not found"));

        if (followRepository.findByFollowerIdAndFollowingId(followerId, followingId).isPresent()) {
            throw new DuplicateResourceException("Already following this user");
        }

        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);
        follow.setCreatedAt(LocalDateTime.now());

        Follow saved = followRepository.save(follow);
        return convertToDTO(saved, follower.getUsername(), following.getUsername());
    }

    @Transactional
    public void unfollowUser(String followerEmail, Long followingId) {
        User follower = resolveUserByEmail(followerEmail);
        Long followerId = follower.getId();

        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
            .orElseThrow(() -> new ResourceNotFoundException("Not following this user"));
        
        followRepository.delete(follow);
    }

    public boolean isFollowing(String followerEmail, Long followingId) {
        if (followerEmail == null) return false;
        User follower = resolveUserByEmail(followerEmail);
        return isFollowing(follower.getId(), followingId);
    }

    public boolean isFollowing(Long followerId, Long followingId) {
        if (followerId == null || followingId == null) return false;
        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId).isPresent();
    }

    private UserFollowStatsDTO mapToStatsDTO(User user, Boolean isFollowing) {
        String displayName = user.getDisplayName() != null ? user.getDisplayName() : user.getUsername();
        String profileImageUrl = user.getProfileImageUrl() != null ? user.getProfileImageUrl() : user.getAvatarUrl();
        Boolean isArtist = false;
        
        Artist artist = artistRepository.findByUserId(user.getId());
        if (artist != null) {
            displayName = artist.getStageName();
            if (artist.getProfileImageUrl() != null) {
                profileImageUrl = artist.getProfileImageUrl();
            }
            isArtist = true;
        }
        
        return new UserFollowStatsDTO(
            user.getId(),
            user.getUsername(),
            followRepository.countByFollowingId(user.getId()),
            followRepository.countByFollowerId(user.getId()),
            isFollowing,
            displayName,
            profileImageUrl,
            isArtist
        );
    }

    private UserFollowStatsDTO mapArtistToStatsDTO(Artist artist, Boolean isFollowing) {
        return new UserFollowStatsDTO(
            artist.getArtistId(),
            artist.getStageName() != null ? artist.getStageName() : "Artist",
            followRepository.countByFollowingArtistId(artist.getArtistId()),
            0,
            isFollowing,
            artist.getStageName(),
            artist.getProfileImageUrl(),
            true
        );
    }

    public List<UserFollowStatsDTO> getFollowing(Long userId, String viewerEmail) {
        User viewer = viewerEmail != null ? userRepository.findByEmail(viewerEmail).orElse(null) : null;
        Long viewerId = viewer != null ? viewer.getId() : null;

        List<Follow> following = followRepository.findByFollowerId(userId);
        
        // Extract IDs for batch fetching
        List<Long> userIds = following.stream()
            .map(Follow::getFollowingId)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
            
        List<Long> artistIds = following.stream()
            .map(Follow::getFollowingArtistId)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        // Batch fetch
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(User::getId, Function.identity()));
            
        Map<Long, Artist> directArtistMap = artistRepository.findAllById(artistIds).stream()
            .collect(Collectors.toMap(Artist::getArtistId, Function.identity()));

        return following.stream().map(follow -> {
            if (follow.getFollowingId() != null) {
                User user = userMap.get(follow.getFollowingId());
                if (user != null) {
                    boolean isUserFollowing = isFollowing(viewerId, user.getId());
                    return mapToStatsDTO(user, isUserFollowing);
                }
            } else if (follow.getFollowingArtistId() != null) {
                Artist artist = directArtistMap.get(follow.getFollowingArtistId());
                if (artist != null) {
                    boolean isUserFollowingArtist = isFollowingArtist(viewerId, artist.getArtistId());
                    return mapArtistToStatsDTO(artist, isUserFollowingArtist);
                }
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public List<UserFollowStatsDTO> getFollowers(Long userId, String viewerEmail) {
        User viewer = viewerEmail != null ? userRepository.findByEmail(viewerEmail).orElse(null) : null;
        Long viewerId = viewer != null ? viewer.getId() : null;

        List<Follow> followers = followRepository.findByFollowingId(userId);
        
        // Extract IDs for batch fetching
        List<Long> userIds = followers.stream()
            .map(Follow::getFollowerId)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
            
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
            .collect(Collectors.toMap(User::getId, Function.identity()));

        return followers.stream().map(follow -> {
            User user = userMap.get(follow.getFollowerId());
            if (user != null) {
                boolean isUserFollowing = isFollowing(viewerId, user.getId());
                return mapToStatsDTO(user, isUserFollowing);
            }
            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public UserFollowStatsDTO getUserStats(Long userId, String viewerEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Boolean isUserFollowing = isFollowing(viewerEmail, userId);
        return mapToStatsDTO(user, isUserFollowing);
    }

    public Integer getFollowersCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    public Integer getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }

    // ================ ARTIST FOLLOWING ================

    @Transactional
    public FollowDTO followArtist(String followerEmail, Long artistId) {
        User follower = resolveUserByEmail(followerEmail);
        Long followerId = follower.getId();

        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        
        if (artist.getUserId() != null) {
            return followUser(followerEmail, artist.getUserId());
        } else {
            if (followRepository.findByFollowerIdAndFollowingArtistId(followerId, artistId).isPresent()) {
                throw new DuplicateResourceException("Already following this artist");
            }
                
            Follow follow = new Follow();
            follow.setFollowerId(followerId);
            follow.setFollowingArtistId(artistId);
            follow.setCreatedAt(LocalDateTime.now());
            
            Follow saved = followRepository.save(follow);
            FollowDTO dto = convertToDTO(saved, follower.getUsername(), artist.getStageName());
            dto.setFollowingArtistId(artistId);
            return dto;
        }
    }

    @Transactional
    public void unfollowArtist(String followerEmail, Long artistId) {
        User follower = resolveUserByEmail(followerEmail);
        Long followerId = follower.getId();

        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        
        if (artist.getUserId() != null) {
            unfollowUser(followerEmail, artist.getUserId());
        } else {
            Follow follow = followRepository.findByFollowerIdAndFollowingArtistId(followerId, artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Not following this artist"));
            followRepository.delete(follow);
        }
    }

    public boolean isFollowingArtist(String followerEmail, Long artistId) {
        if (followerEmail == null) return false;
        User follower = resolveUserByEmail(followerEmail);
        return isFollowingArtist(follower.getId(), artistId);
    }

    public boolean isFollowingArtist(Long followerId, Long artistId) {
        if (followerId == null || artistId == null) return false;
        Artist artist = artistRepository.findById(artistId)
            .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));
        
        if (artist.getUserId() != null) {
            return isFollowing(followerId, artist.getUserId());
        } else {
            return followRepository.findByFollowerIdAndFollowingArtistId(followerId, artistId).isPresent();
        }
    }

    private FollowDTO convertToDTO(Follow follow, String followerName, String followingName) {
        FollowDTO dto = new FollowDTO();
        dto.setFollowId(follow.getFollowId());
        dto.setFollowerId(follow.getFollowerId());
        dto.setFollowingId(follow.getFollowingId());
        dto.setFollowingArtistId(follow.getFollowingArtistId());
        dto.setFollowerName(followerName);
        dto.setFollowingName(followingName);
        dto.setCreatedAt(follow.getCreatedAt());
        return dto;
    }
}
