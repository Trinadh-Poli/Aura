import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import playlistService from '../services/playlistService';

const PlaylistList = ({ userId }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPlaylists = async () => {
            let uid = userId;
            if (!uid) {
                const currentUserRes = await authService.getCurrentUser();
                if (currentUserRes.success) {
                    uid = currentUserRes.user.id;
                }
            }
            if (uid) {
                fetchPlaylists(uid);
            } else {
                setLoading(false); // No user, stop loading
            }
        };
        loadPlaylists();

        const handlePlaylistsUpdated = () => {
            let uid = userId;
            if (!uid) {
                authService.getCurrentUser().then(currentUserRes => {
                    if (currentUserRes.success) {
                        fetchPlaylists(currentUserRes.user.id);
                    }
                });
            } else {
                fetchPlaylists(uid);
            }
        };

        window.addEventListener('playlistsUpdated', handlePlaylistsUpdated);
        return () => window.removeEventListener('playlistsUpdated', handlePlaylistsUpdated);
    }, [userId]);

    const fetchPlaylists = async (uid) => {
        setLoading(true);
        const result = await playlistService.getUserPlaylists(uid);

        if (result.success) {
            setPlaylists(result.playlists);
        } else {
            console.error('Failed to fetch playlists:', result.error);
        }

        setLoading(false);
    };

    const handleCreatePlaylist = () => {
        setShowCreateModal(true);
    };

    const handlePlaylistCreated = () => {
        setShowCreateModal(false);
        window.dispatchEvent(new Event('playlistsUpdated')); // Refresh playlists everywhere
    };

    if (loading) {
        return <div className="text-white p-8">Loading playlists...</div>;
    }

    return (
        <div className="p-8 overflow-y-auto" style={{ height: 'calc(100vh - 170px)' }}>
            <section>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Your Playlists</h2>
                        <p className="text-gray-400">Manage and listen to your playlists</p>
                    </div>
                    <button
                        onClick={handleCreatePlaylist}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                    >
                        <Plus size={20} />
                        Create Playlist
                    </button>
                </div>

                {/* Playlists Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist.playlistId}
                            onClick={() => navigate(`/playlists/${playlist.playlistId}`)}
                            className="item-card card-square cursor-pointer"
                        >
                            <div className="item-card-image-wrapper rounded-md overflow-hidden mb-4">
                                <img
                                    src={playlist.coverImageUrl || `https://placehold.co/200x200/5a189a/ffffff?text=${encodeURIComponent(playlist.title || 'Playlist')}`}
                                    alt={playlist.title}
                                    className="item-card-image item-square"
                                />
                            </div>
                            <div className="item-card-details">
                                <h3 className="item-card-title">{playlist.title}</h3>
                                <p className="item-card-artist">
                                    {playlist.songCount || 0} songs
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {playlists.length === 0 && (
                    <div className="text-center mt-16">
                        <p className="text-gray-400 text-lg mb-4">You don't have any playlists yet</p>
                        <button
                            onClick={handleCreatePlaylist}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                        >
                            Create Your First Playlist
                        </button>
                    </div>
                )}
            </section>

            {/* Create Playlist Modal */}
            {showCreateModal && (
                <CreatePlaylistModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handlePlaylistCreated}
                    userId={userId}
                />
            )}
        </div>
    );
};

// Simple create playlist modal component
const CreatePlaylistModal = ({ onClose, onSuccess, userId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Please enter a playlist name');
            return;
        }

        setLoading(true);
        setError('');

        const result = await playlistService.createPlaylist(userId, {
            title: name,
            description,
            isPublic
        });

        setLoading(false);

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error || 'Failed to create playlist');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-white mb-4">Create Playlist</h3>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-[#2c2c2c] text-white border border-gray-600 rounded focus:outline-none focus:border-white"
                            placeholder="My Playlist"
                            autoFocus
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-[#2c2c2c] text-white border border-gray-600 rounded focus:outline-none focus:border-white"
                            placeholder="Describe your playlist..."
                            rows="3"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Make playlist public</span>
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaylistList;
