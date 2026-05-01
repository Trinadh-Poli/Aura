import { Music, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../services/authService';
import followService from '../services/followService';
import playlistService from '../services/playlistService';

export default function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // Demo users for testing
    const demoUsers = {
        '1': {
            id: 1,
            username: 'the_weeknd',
            displayName: 'The Weeknd',
            bio: 'Artist 🎤 | Producer | Songwriter',
            isVerified: true,
            roles: [{ id: 2, name: 'ARTIST' }],
            followerCount: 15234,
            followingCount: 42,
            playlistCount: 8
        },
        '2': {
            id: 2,
            username: 'billie_eilish',
            displayName: 'Billie Eilish',
            bio: 'Music creator 🌊 | Ocean Eyes',
            isVerified: true,
            roles: [{ id: 2, name: 'ARTIST' }],
            followerCount: 23567,
            followingCount: 89,
            playlistCount: 12
        },
        '3': {
            id: 3,
            username: 'music_lover_pro',
            displayName: 'Alex Johnson',
            bio: 'Music enthusiast | Playlist curator | Discovering new sounds daily',
            isVerified: false,
            roles: [{ id: 1, name: 'USER' }],
            followerCount: 432,
            followingCount: 156,
            playlistCount: 24
        }
    };

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        setLoading(true);

        // Try to get from backend first
        const result = await authService.getProfile(userId);

        if (result.success) {
            setProfile(result.user);
            // Get real follow stats from backend
            const statsResult = await followService.getFollowStats(userId);
            if (statsResult.success) {
                setProfile(prev => ({ ...prev, ...statsResult.stats }));
            }
            
            // Get real playlist count
            const playlistResult = await playlistService.getUserPlaylists(userId);
            if (playlistResult.success) {
                setProfile(prev => ({ ...prev, playlistCount: playlistResult.playlists.length }));
            }
        } else {
            // Fall back to demo users
            const demoProfile = demoUsers[userId] || demoUsers['1'];
            setProfile(demoProfile);
        }

        // Check if currently following this user
        const followCheckResult = await followService.isFollowing(userId);
        if (followCheckResult.success) {
            setIsFollowing(followCheckResult.isFollowing);
        }

        setLoading(false);
    };

    const handleFollowToggle = async () => {
        setFollowLoading(true);

        let result;
        if (isFollowing) {
            result = await followService.unfollow(userId);
        } else {
            result = await followService.follow(userId);
        }

        if (result.success) {
            setIsFollowing(!isFollowing);
            // Update follower count locally
            setProfile(prev => ({
                ...prev,
                followerCount: isFollowing
                    ? prev.followerCount - 1
                    : prev.followerCount + 1
            }));
        } else {
            console.error('Follow/unfollow failed:', result.error);
        }

        setFollowLoading(false);
    };

    const isArtist = profile?.roles?.some(role => role.name === 'ARTIST');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-black">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-full bg-black">
                <div className="text-red-400">User not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="mb-6">
                    <div className="flex items-start gap-6 mb-5">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-5xl font-bold">
                                {profile.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-white">{profile.displayName || profile.username}</h1>
                                {profile.isVerified && (
                                    <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {isArtist && (
                                    <span className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        <Music size={12} />
                                        Artist
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-400 text-sm mb-3">@{profile.username}</p>

                            {/* Stats */}
                            <div className="flex gap-6 mb-4">
                                <div className="text-center">
                                    <div className="text-white font-semibold">{profile.playlistCount || 0}</div>
                                    <div className="text-gray-400 text-sm">Playlists</div>
                                </div>
                                <button className="text-center hover:opacity-80 transition-opacity">
                                    <div className="text-white font-semibold">{profile.followerCount || 0}</div>
                                    <div className="text-gray-400 text-sm">Followers</div>
                                </button>
                                <button className="text-center hover:opacity-80 transition-opacity">
                                    <div className="text-white font-semibold">{profile.followingCount || 0}</div>
                                    <div className="text-gray-400 text-sm">Following</div>
                                </button>
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-white text-sm mb-4">{profile.bio}</p>
                            )}

                            {/* Follow Button */}
                            <button
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${isFollowing
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                <Users size={18} />
                                {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="border-b border-gray-800 mb-6">
                    <div className="flex gap-8">
                        <button className="pb-3 border-b-2 border-white text-white font-semibold">
                            Playlists
                        </button>
                        {isArtist && (
                            <button className="pb-3 text-gray-400 hover:text-white transition-colors">
                                Albums
                            </button>
                        )}
                    </div>
                </div>

                {/* Placeholder Content */}
                <div className="text-center py-12">
                    <p className="text-gray-400">No playlists yet</p>
                </div>
            </div>
        </div>
    );
}
