import { Grid3x3, Library, Music, Settings, UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import followService from '../services/followService';
import playlistService from '../services/playlistService';
import VerifiedBadge from './VerifiedBadge';

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('playlists');
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [stats, setStats] = useState({
        playlists: 0
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        const result = await authService.getCurrentUser();

        if (result.success && result.user) {
            setProfile(result.user);
            
            // Fetch real stats, playlists, and following list
            const userId = result.user.id;
            const [playlistResult, followingResult] = await Promise.all([
                playlistService.getUserPlaylists(userId),
                followService.getFollowing(userId)
            ]);
            
            if (playlistResult.success) setUserPlaylists(playlistResult.playlists);
            if (followingResult && followingResult.success) setFollowingList(followingResult.following);
            
            setStats({
                playlists: playlistResult.success ? playlistResult.playlists.length : 0
            });

        } else {
            // Demo profile
            const demoProfile = {
                id: 1,
                username: 'demouser',
                email: 'demo@aura.com',
                displayName: 'Demo User',
                bio: 'Music lover 🎵 | Playlist curator | Always discovering new sounds',
                isVerified: true,
                roles: [{ role: 'USER' }]
            };
            setProfile(demoProfile);
        }

        setLoading(false);
    };

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
                <div className="text-red-400">Failed to load profile</div>
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

                        {/* Profile Info - Right Side */}
                        <div className="flex-1 min-w-0">
                            {/* Username Row */}
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-xl text-white font-semibold">{profile.username}</h1>
                                {(profile.isVerified || profile.roles?.some(r => r.role === 'ARTIST')) && <VerifiedBadge />}
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="p-1.5 hover:bg-gray-900 rounded-lg transition-colors"
                                >
                                    <Settings size={22} className="text-white" />
                                </button>
                            </div>

                            {/* Name & Pronouns */}
                            <div className="mb-3">
                                <div className="text-white font-semibold">{profile.displayName || 'Trinadh'}</div>
                                <div className="text-gray-400 text-sm">he/him</div>
                            </div>



                            {/* Bio */}
                            <div className="text-white text-sm whitespace-pre-line">
                                {profile.bio || 'No bio yet'}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <button
                            onClick={() => navigate('/edit-profile')}
                            className="bg-[#1a1a1a] hover:bg-[#262626] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Edit Profile
                        </button>
                        <button className="bg-[#1a1a1a] hover:bg-[#262626] text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            Share Profile
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-800">
                    <div className="flex justify-center">
                        <button
                            onClick={() => setActiveTab('playlists')}
                            className={`flex items-center gap-2 py-3.5 px-8 border-t transition-colors ${activeTab === 'playlists'
                                ? 'border-white text-white'
                                : 'border-transparent text-gray-500'
                                }`}
                        >
                            <Grid3x3 size={12} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Playlists</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('following')}
                            className={`flex items-center gap-2 py-3.5 px-8 border-t transition-colors ${activeTab === 'following'
                                ? 'border-white text-white'
                                : 'border-transparent text-gray-500'
                                }`}
                        >
                            <UserCircle size={12} />
                            <span className="text-xs font-semibold uppercase tracking-wider">Following</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                    {activeTab === 'playlists' && (
                        <div className="space-y-3">
                            {userPlaylists.length > 0 ? userPlaylists.map((playlist) => (
                                <div
                                    key={playlist.playlistId}
                                    className="flex items-center gap-4 p-3 hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition-colors"
                                    onClick={() => navigate(`/playlists/${playlist.playlistId}`)}
                                >
                                    <img
                                        src={`https://picsum.photos/seed/${playlist.playlistId}/300/300`}
                                        alt={playlist.name}
                                        className="w-14 h-14 rounded-md flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-medium truncate">{playlist.name}</div>
                                        <div className="text-gray-400 text-sm">{playlist.isPublic ? 'Public' : 'Private'}</div>
                                    </div>
                                    <Music size={20} className="text-gray-600 flex-shrink-0" />
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 py-16">
                                    <Library size={48} className="mx-auto mb-4 opacity-30" />
                                    <p className="text-lg font-light">No playlists yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'following' && (
                        <div className="space-y-3">
                            {followingList && followingList.length > 0 ? followingList.map((userFollow) => (
                                <div
                                    key={userFollow.userId}
                                    className="flex items-center justify-between p-3 hover:bg-[#1a1a1a] rounded-lg cursor-pointer transition-colors"
                                    onClick={() => navigate(userFollow.isArtist ? `/artists/${userFollow.userId}` : `/user/${userFollow.userId}`)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-medium truncate">{userFollow.displayName || userFollow.username}</div>
                                        <div className="text-gray-400 text-sm">{userFollow.isArtist ? 'Artist' : 'User'}</div>
                                    </div>
                                    
                                    <img
                                        src={userFollow.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userFollow.displayName || userFollow.username)}&background=random`}
                                        alt={userFollow.displayName}
                                        className="w-14 h-14 rounded-full flex-shrink-0 ml-4 object-cover"
                                    />
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 py-16">
                                    <UserCircle size={48} className="mx-auto mb-4 opacity-30" />
                                    <p className="text-lg font-light">Not following anyone yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
