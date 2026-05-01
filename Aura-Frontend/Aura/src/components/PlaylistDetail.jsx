import { ArrowLeft, Edit, Play, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import playlistService from '../services/playlistService';

const PlaylistDetail = ({ onSongClick }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPlaylistData();
    }, [id]);

    const fetchPlaylistData = async () => {
        setLoading(true);

        const playlistResult = await playlistService.getPlaylistById(id);
        if (playlistResult.success) {
            setPlaylist(playlistResult.playlist);
            // Songs might be included in playlist object or fetch separately
            if (playlistResult.playlist.songs) {
                setSongs(playlistResult.playlist.songs);
            }
        }

        setLoading(false);
    };

    const handleDeletePlaylist = async () => {
        if (!confirm('Are you sure you want to delete this playlist?')) {
            return;
        }

        const result = await playlistService.deletePlaylist(id);
        if (result.success) {
            navigate('/playlists');
        }
    };

    const handleRemoveSong = async (songId) => {
        const result = await playlistService.removeSongFromPlaylist(id, songId);
        if (result.success) {
            setSongs(songs.filter(song => song.id !== songId));
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <div className="text-white p-8">Loading playlist...</div>;
    }

    if (!playlist) {
        return <div className="text-white p-8">Playlist not found</div>;
    }

    return (
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 170px)' }}>
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-purple-700 to-black p-8 pb-6">
                <button
                    onClick={() => navigate('/playlists')}
                    className="text-white hover:text-gray-300 flex items-center gap-2 mb-6"
                >
                    <ArrowLeft size={24} />
                    Back to Playlists
                </button>

                <div className="flex items-end gap-6">
                    <img
                        src={playlist.coverImageUrl || `https://placehold.co/232x232/5a189a/ffffff?text=${encodeURIComponent(playlist.title || 'Playlist')}`}
                        alt={playlist.title}
                        className="w-58 h-58 shadow-2xl rounded"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-white mb-2">PLAYLIST</p>
                        <h1 className="text-5xl font-bold text-white mb-4">{playlist.title}</h1>
                        {playlist.description && (
                            <p className="text-gray-300 mb-2">{playlist.description}</p>
                        )}
                        <p className="text-gray-400 text-sm">
                            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                            {playlist.isPublic && ' • Public'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            title="Edit playlist"
                        >
                            <Edit size={20} className="text-white" />
                        </button>
                        <button
                            onClick={handleDeletePlaylist}
                            className="p-3 bg-red-600/20 hover:bg-red-600/40 rounded-full transition-colors"
                            title="Delete playlist"
                        >
                            <Trash2 size={20} className="text-red-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Songs List */}
            <div className="p-8">
                {songs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">This playlist is empty</p>
                        <p className="text-gray-500 mt-2">Add some songs to get started</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {songs.map((song, index) => (
                            <div
                                key={song.songId || index}
                                className="group flex items-center gap-4 p-3 rounded hover:bg-white/10 transition-colors"
                            >
                                {/* Track Number / Play Button */}
                                <div className="w-8 text-center">
                                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                                    <button
                                        onClick={() => onSongClick({
                                            id: song.songId,
                                            title: song.title,
                                            artist: song.artistName || 'Unknown Artist',
                                            audioUrl: `/api/stream/song/${song.songId}`,
                                            durationSeconds: song.duration
                                        })}
                                        className="hidden group-hover:block"
                                    >
                                        <Play
                                            size={16}
                                            className="text-white fill-white mx-auto"
                                        />
                                    </button>
                                </div>

                                {/* Song Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-medium truncate">{song.title}</div>
                                    <div className="text-gray-400 text-sm truncate">
                                        {song.artistName || 'Unknown Artist'}
                                    </div>
                                </div>

                                {/* Album */}
                                {song.album && (
                                    <div className="hidden md:block text-gray-400 text-sm flex-1 min-w-0 truncate">
                                        {song.album}
                                    </div>
                                )}

                                {/* Duration */}
                                <div className="text-gray-400 text-sm">
                                    {formatDuration(song.duration || 0)}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveSong(song.songId)}
                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded transition-opacity"
                                    title="Remove from playlist"
                                >
                                    <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistDetail;
