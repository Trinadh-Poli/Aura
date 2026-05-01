package com.aura.follow.repository;

import com.aura.follow.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    // Check if user A follows user B
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    // Get all users that follower_id is following
    List<Follow> findByFollowerId(Long followerId);
    
    // Get all followers of following_id
    List<Follow> findByFollowingId(Long followingId);
    
    // Count followers
    Integer countByFollowingId(Long followingId);
    
    // Count following
    Integer countByFollowerId(Long followerId);
    
    // Check if user A follows catalog artist B
    Optional<Follow> findByFollowerIdAndFollowingArtistId(Long followerId, Long followingArtistId);
    
    // Get all followers of catalog artist
    List<Follow> findByFollowingArtistId(Long followingArtistId);
    
    // Count followers of catalog artist
    Integer countByFollowingArtistId(Long followingArtistId);
}
