package com.aura.follow.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aura.follow.dto.FollowDTO;
import com.aura.follow.dto.UserFollowStatsDTO;
import com.aura.follow.service.FollowService;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    // ✅ FOLLOW USER
    @PostMapping("/user/{followingId}")
    public ResponseEntity<FollowDTO> followUser(
        @AuthenticationPrincipal UserDetails followerPrincipal,
        @PathVariable Long followingId) {
        
        String followerEmail = followerPrincipal.getUsername();
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(followService.followUser(followerEmail, followingId));
    }

    // ✅ UNFOLLOW USER
    @DeleteMapping("/user/{followingId}")
    public ResponseEntity<Void> unfollowUser(
            @AuthenticationPrincipal UserDetails followerPrincipal,
            @PathVariable Long followingId) {
        
        String followerEmail = followerPrincipal.getUsername();
        followService.unfollowUser(followerEmail, followingId);
        return ResponseEntity.noContent().build();
    }

    // ✅ CHECK IF FOLLOWING (Only checks if *current* user is following *another* user)
    @GetMapping("/check/{followingId}")
    public ResponseEntity<Map<String, Boolean>> isFollowing(
            @AuthenticationPrincipal UserDetails followerPrincipal,
            @PathVariable Long followingId) {
        
        String followerEmail = followerPrincipal.getUsername();
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", followService.isFollowing(followerEmail, followingId));
        return ResponseEntity.ok(response);
    }
    
    // ✅ GET FOLLOWING LIST
    @GetMapping("/following/{userId}")
    public ResponseEntity<List<UserFollowStatsDTO>> getFollowing(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails currentViewerPrincipal) {
        String viewerEmail = currentViewerPrincipal != null ? currentViewerPrincipal.getUsername() : null;
        return ResponseEntity.ok(followService.getFollowing(userId, viewerEmail));
    }

    // ✅ GET FOLLOWERS LIST
    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserFollowStatsDTO>> getFollowers(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails currentViewerPrincipal) {
        String viewerEmail = currentViewerPrincipal != null ? currentViewerPrincipal.getUsername() : null;
        return ResponseEntity.ok(followService.getFollowers(userId, viewerEmail));
    }

    // ✅ GET USER FOLLOW STATS
    @GetMapping("/stats/{userId}")
    public ResponseEntity<UserFollowStatsDTO> getUserStats(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails currentViewerPrincipal) {
        
        String viewerEmail = currentViewerPrincipal != null ? currentViewerPrincipal.getUsername() : null;
        return ResponseEntity.ok(followService.getUserStats(userId, viewerEmail));
    }

    // ✅ GET FOLLOWERS COUNT
    @GetMapping("/count/followers/{userId}")
    public ResponseEntity<Map<String, Integer>> getFollowersCount(@PathVariable Long userId) {
        Map<String, Integer> response = new HashMap<>();
        response.put("followersCount", followService.getFollowersCount(userId));
        return ResponseEntity.ok(response);
    }

    // ✅ GET FOLLOWING COUNT
    @GetMapping("/count/following/{userId}")
    public ResponseEntity<Map<String, Integer>> getFollowingCount(@PathVariable Long userId) {
        Map<String, Integer> response = new HashMap<>();
        response.put("followingCount", followService.getFollowingCount(userId));
        return ResponseEntity.ok(response);
    }
    
    // ✅ FOLLOW ARTIST
    @PostMapping("/artist/{artistId}")
    public ResponseEntity<FollowDTO> followArtist(
        @AuthenticationPrincipal UserDetails followerPrincipal,
        @PathVariable Long artistId) {
        
        String followerEmail = followerPrincipal.getUsername();
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(followService.followArtist(followerEmail, artistId));
    }

    // ✅ UNFOLLOW ARTIST
    @DeleteMapping("/artist/{artistId}")
    public ResponseEntity<Void> unfollowArtist(
            @AuthenticationPrincipal UserDetails followerPrincipal,
            @PathVariable Long artistId) {
        
        String followerEmail = followerPrincipal.getUsername();
        followService.unfollowArtist(followerEmail, artistId);
        return ResponseEntity.noContent().build();
    }

    // ✅ CHECK IF FOLLOWING ARTIST
    @GetMapping("/artist/{artistId}/check")
    public ResponseEntity<Map<String, Boolean>> isFollowingArtist(
            @AuthenticationPrincipal UserDetails followerPrincipal,
            @PathVariable Long artistId) {
        
        String followerEmail = followerPrincipal.getUsername();
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", followService.isFollowingArtist(followerEmail, artistId));
        return ResponseEntity.ok(response);
    }
}