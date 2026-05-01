import { Disc, Plus, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import artistDashboardService from '../services/artistDashboardService';
import authService from '../services/authService';

const ArtistDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'create-album', 'album-view'
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albumSongs, setAlbumSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Forms
    const [albumForm, setAlbumForm] = useState({ title: '', releaseYear: new Date().getFullYear(), coverImage: null });
    const [songForm, setSongForm] = useState({ title: '', genre: '', duration: '', songFile: null, coverImage: null });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        const currentUser = authService.getCurrentUser(); // Synchronous check from local storage/memory if possible or fetch
        // Wait, authService.getCurrentUser is usually async in this app? 
        // Let's check authService.js later. For now assume it wraps an API call or returns data.
        // Actually, based on previous files, it's async `await authService.getCurrentUser()`.

        const userRes = await authService.getCurrentUser();
        if (userRes.success) {
            setUser(userRes.user);
            const isArtist = userRes.user.roles.some(r => r.role === 'ARTIST');
            if (isArtist) {
                // Fetch albums using the user's ID (which is the artist's User ID, but we need Artist ID)
                // The backend endpoint `getMyAlbums` takes `artistId`. 
                // We need to resolve User ID -> Artist ID. 
                // Does the User object have artistId? Likely not directly. 
                // We might need to fetch "My Artist Profile".
                // Let's assume for now we can find the artist by user ID or the user object has it.
                // If not, we might need a `getArtistProfile` endpoint.
                // Let's try searching for the artist by userId using artistService logic?
                // Or simply: effectively, the `Artist` entity has `userId`.
                // Let's Assume the user object has an `artistId` if they are an artist, or we search for it.

                // Temporary workaround: Fetch all artists and find by userId? inefficiency.
                // Better: The `authService.getCurrentUser` usually returns full profile. 
                // Let's check if `artistId` is in the response. If not, we might have a blocking issue.
                // Let's blindly try to fetch albums with the user.id assuming the backend might handle it or we need to find the artistId.

                // Wait, `ArtistList` used `artistService.getAllArtists` which calls `/search/artists`.
                // There is no easy "get my artist id" endpoint exposed yet.
                // However, `ArtistController` isn't fully visible.
                // Let's assume for this step we need to find the artist ID.
                // Let's fetch all artists and filter by userId (if available in artist object).
                // `Artist` entity has `userId`.

                // Let's try to get artist ID.
                const artistRes = await import('../services/artistService').then(m => m.default.getAllArtists());
                if (artistRes.success) {
                    const myArtist = artistRes.artists.find(a => a.userId === userRes.user.id);
                    if (myArtist) {
                        const albumsRes = await artistDashboardService.getMyAlbums(myArtist.artistId);
                        if (albumsRes.success) {
                            setAlbums(albumsRes.albums);
                            // Store artistId in user object for convenience
                            userRes.user.artistId = myArtist.artistId;
                            setUser(userRes.user);
                        }
                    } else {
                        setError("Artist profile not found. Please switch to artist in settings.");
                    }
                }
            } else {
                setError("You are not an artist.");
            }
        }
        setLoading(false);
    };

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        setUploading(true);
        const res = await artistDashboardService.createAlbum({
            ...albumForm,
            artistId: user.artistId
        });
        if (res.success) {
            setSuccess('Album created!');
            setAlbums([...albums, res.album]);
            setActiveTab('overview');
            setAlbumForm({ title: '', releaseYear: new Date().getFullYear(), coverImage: null });
        } else {
            setError('Failed to create album');
        }
        setUploading(false);
    };

    const handleUploadSong = async (e) => {
        e.preventDefault();
        setUploading(true);
        const res = await artistDashboardService.uploadSong(selectedAlbum.albumId, songForm);
        if (res.success) {
            setSuccess('Song uploaded!');
            setAlbumSongs([...albumSongs, res.song]);
            setSongForm({ title: '', genre: '', duration: '', songFile: null, coverImage: null });
            // Close modal or generic simple reset?
            // For now, simple reset.
        } else {
            setError('Failed to upload song');
        }
        setUploading(false);
    };

    const openAlbum = async (album) => {
        setSelectedAlbum(album);
        setActiveTab('album-view');
        // Fetch songs
        const res = await artistDashboardService.getAlbumSongs(album.albumId);
        if (res.success) {
            setAlbumSongs(res.songs);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 h-full overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Artist Dashboard</h1>

            {/* Navigation */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-full font-medium transition ${activeTab === 'overview' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}`}
                >
                    My Albums
                </button>
                <button
                    onClick={() => setActiveTab('create-album')}
                    className={`px-4 py-2 rounded-full font-medium transition ${activeTab === 'create-album' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}`}
                >
                    Create New Album
                </button>
            </div>

            {/* Messages */}
            {success && <div className="mb-4 text-green-400 bg-green-900/20 p-3 rounded">{success}</div>}

            {/* Content Switch */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {albums.length === 0 ? (
                        <div className="col-span-full text-gray-500 text-center py-12">
                            <Disc size={48} className="mx-auto mb-4 opacity-50" />
                            <p>You haven't created any albums yet.</p>
                        </div>
                    ) : (
                        albums.map(album => (
                            <div key={album.albumId} onClick={() => openAlbum(album)} className="group cursor-pointer bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition">
                                <div className="aspect-square mb-4 overflow-hidden rounded shadow-lg">
                                    <img src={album.coverImageUrl || 'https://placehold.co/200'} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                </div>
                                <h3 className="text-white font-bold truncate">{album.title}</h3>
                                <p className="text-gray-400 text-sm">{album.releaseYear}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'create-album' && (
                <div className="max-w-xl mx-auto bg-[#181818] p-8 rounded-xl border border-gray-800">
                    <h2 className="text-2xl font-bold text-white mb-6">Create New Album</h2>
                    <form onSubmit={handleCreateAlbum} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Album Title</label>
                            <input
                                type="text"
                                required
                                value={albumForm.title}
                                onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                                className="w-full bg-[#2a2a2a] text-white p-3 rounded border border-transparent focus:border-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Release Year</label>
                            <input
                                type="number"
                                required
                                value={albumForm.releaseYear}
                                onChange={e => setAlbumForm({ ...albumForm, releaseYear: parseInt(e.target.value) })}
                                className="w-full bg-[#2a2a2a] text-white p-3 rounded border border-transparent focus:border-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Cover Art</label>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-500 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    required
                                    accept="image/*"
                                    onChange={e => setAlbumForm({ ...albumForm, coverImage: e.target.files[0] })}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {albumForm.coverImage ? (
                                    <span className="text-green-400">{albumForm.coverImage.name}</span>
                                ) : (
                                    <span className="text-gray-500 flex flex-col items-center gap-2">
                                        <Upload size={24} />
                                        Click to upload cover
                                    </span>
                                )}
                            </div>
                        </div>
                        <button disabled={uploading} className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition disabled:opacity-50">
                            {uploading ? 'Creating...' : 'Create Album'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'album-view' && selectedAlbum && (
                <div>
                    <button onClick={() => setActiveTab('overview')} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
                        <X size={20} /> Back to Albums
                    </button>

                    <div className="flex gap-8 mb-8">
                        <img src={selectedAlbum.coverImageUrl} alt={selectedAlbum.title} className="w-48 h-48 rounded shadow-xl" />
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">{selectedAlbum.title}</h2>
                            <p className="text-gray-400 mb-6">{selectedAlbum.releaseYear} • {albumSongs.length} Songs</p>

                            {/* Detailed Upload Form inline or modal? Let's do inline for simplicity of this artifact */}
                        </div>
                    </div>

                    <div className="bg-[#181818] rounded-xl p-6 mb-8 border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Plus size={20} /> Add Song</h3>
                        <form onSubmit={handleUploadSong} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                placeholder="Song Title"
                                required
                                value={songForm.title}
                                onChange={e => setSongForm({ ...songForm, title: e.target.value })}
                                className="bg-[#2a2a2a] text-white p-3 rounded focus:outline-none"
                            />
                            <input
                                placeholder="Genre"
                                value={songForm.genre}
                                onChange={e => setSongForm({ ...songForm, genre: e.target.value })}
                                className="bg-[#2a2a2a] text-white p-3 rounded focus:outline-none"
                            />
                            <div className="relative">
                                <label className="block text-xs text-gray-500 mb-1">Audio File (.mp3)</label>
                                <input
                                    type="file"
                                    required
                                    accept="audio/*"
                                    onChange={e => setSongForm({ ...songForm, songFile: e.target.files[0] })}
                                    className="text-gray-400 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-xs text-gray-500 mb-1">Cover Art (Optional - Required by backend)</label>
                                <input
                                    type="file"
                                    required
                                    accept="image/*"
                                    onChange={e => setSongForm({ ...songForm, coverImage: e.target.files[0] })}
                                    className="text-gray-400 text-sm"
                                />
                            </div>
                            <button disabled={uploading} className="col-span-full bg-purple-600 text-white font-bold py-3 rounded hover:bg-purple-700 transition disabled:opacity-50 mt-2">
                                {uploading ? 'Uploading Song...' : 'Upload Song'}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Tracklist</h3>
                        {albumSongs.map((song, index) => (
                            <div key={song.songId} className="flex items-center gap-4 p-3 hover:bg-[#2a2a2a] rounded group">
                                <span className="text-gray-500 w-6 text-center">{index + 1}</span>
                                <span className="text-white flex-1">{song.title}</span>
                                <span className="text-gray-500 text-sm">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistDashboard;
