import { Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function EditProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        avatarUrl: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError('');

        const result = await authService.getCurrentUser();

        if (result.success) {
            setProfile(result.user);
            setFormData({
                displayName: result.user.displayName || '',
                bio: result.user.bio || '',
                avatarUrl: result.user.avatarUrl || result.user.profileImageUrl || ''
            });
        } else {
            // Show demo profile when not authenticated
            const demoProfile = {
                id: 1,
                username: 'demouser',
                email: 'demo@aura.com',
                displayName: 'Demo User',
                bio: 'Music lover 🎵 | Playlist curator | Always discovering new sounds',
                isVerified: true,
                roles: [{ id: 1, name: 'USER' }]
            };
            setProfile(demoProfile);
            setFormData({
                displayName: demoProfile.displayName,
                bio: demoProfile.bio,
                avatarUrl: ''
            });
        }

        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        // Check if using demo profile
        if (profile.email === 'demo@aura.com') {
            setError('Please login to save profile changes');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        const result = await authService.updateProfile(profile.id, formData);

        if (result.success) {
            setProfile(result.user);
            setSuccess('Profile updated successfully!');
            setTimeout(() => {
                setSuccess('');
                navigate('/profile');
            }, 1500);
        } else {
            setError(result.error || 'Failed to update profile');
        }

        setSaving(false);
    };

    const handleSwitchToArtist = async () => {
        // Check if using demo profile
        if (profile.email === 'demo@aura.com') {
            setError('Please login to become an artist');
            return;
        }

        if (!window.confirm('Do you want to become an artist? You will be able to upload music.')) {
            return;
        }

        const result = await authService.switchToArtist(profile.id);

        if (result.success) {
            setSuccess('You are now an artist! 🎵');
            loadProfile(); // Reload to get updated roles
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.error || 'Failed to switch to artist');
        }
    };

    const isArtist = profile?.roles?.some(role => role.role === 'ARTIST');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-400">Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-400 text-sm">{success}</p>
                    </div>
                )}

                {/* Edit Profile Form */}
                <div className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="bg-[#1a1a1a] rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                    {profile.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{profile.username}</div>
                                    <div className="text-gray-400 text-sm">{profile.displayName || 'Add name'}</div>
                                </div>
                            </div>
                            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                                Change photo
                            </button>
                        </div>
                    </div>

                    {/* Username (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Username
                        </label>
                        <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 text-gray-500">
                            {profile.username}
                        </div>
                    </div>

                    {/* Name (Display Name) */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                            placeholder="Name"
                            maxLength={100}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-[#1a1a1a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none transition-all"
                            placeholder="Bio"
                            maxLength={150}
                        />
                        <p className="text-xs text-gray-600 mt-1.5 text-right">{formData.bio.length} / 150</p>
                    </div>

                    {/* Switch to Artist Button */}
                    {!isArtist && (
                        <div className="pt-2">
                            <button
                                onClick={handleSwitchToArtist}
                                className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-white font-medium py-3 px-6 rounded-xl transition-colors"
                            >
                                <Music size={18} />
                                Switch to Artist
                            </button>
                            <p className="text-xs text-gray-600 mt-2 text-center">
                                Artists can upload and share their music
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                        >
                            {saving ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
