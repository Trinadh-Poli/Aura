import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import artistService from '../services/artistService';
import followService from '../services/followService';
import ItemCard from './ItemCard';
import VerifiedBadge from './VerifiedBadge';
import { BASE_URL } from '../services/api';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const hostUrl = BASE_URL.replace('/api', '');
    return `${hostUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ArtistDetail = ({ onSongClick }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('albums');
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchArtistData();
    }, [id]);

    const fetchArtistData = async () => {
        setLoading(true);

        // Fetch artist details
        const artistResult = await artistService.getArtistById(id);
        if (artistResult.success) {
            setArtist(artistResult.artist);
        }

        // Check if following
        const followResult = await followService.isFollowingArtist(id);
        if (followResult.success) {
            setIsFollowing(followResult.isFollowing);
        }

        // Fetch artist songs
        const songsResult = await artistService.getArtistSongs(id);
        if (songsResult.success) {
            setSongs(songsResult.songs);
        }

        setLoading(false);
    };

    const handleFollowToggle = async () => {
        if (isFollowing) {
            const result = await followService.unfollowArtist(id);
            if (result.success) setIsFollowing(false);
        } else {
            const result = await followService.followArtist(id);
            if (result.success) setIsFollowing(true);
        }
    };

    if (loading) {
        return <div className="text-white p-8">Loading artist...</div>;
    }

    if (!artist) {
        return <div className="text-white p-8">Artist not found</div>;
    }

    const isCatalogArtist = !artist.userId; // Catalog artists don't have userId

    return (
        <div className="overflow-y-auto bg-black min-h-screen" style={{ height: '100vh', width: '100%' }}>
            {/* Hero Banner with Background Image */}
            <div className="relative h-[340px] bg-gradient-to-b from-purple-900/40 to-black overflow-hidden">
                {/* Back Button - Inside hero banner to overlay image */}
                <div className="absolute top-4 left-8 z-30">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:bg-white/10 rounded-full p-2 transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>

                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${getImageUrl(artist.headerImageUrl) || getImageUrl(artist.profileImageUrl) || `https://loremflickr.com/1200/400/${encodeURIComponent(artist.stageName || artist.name).toLowerCase().replace(/%20/g, '')},concert/all`})`,
                        filter: 'blur(0px)'
                    }}
                />
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

                {/* Artist Info Overlaid on Banner */}
                <div className="relative h-full flex flex-col justify-end p-8">
                    {/* Verified Badge */}
                    {isCatalogArtist && (
                        <div className="flex items-center gap-2 mb-2">
                            <VerifiedBadge size={20} />
                            <span className="text-sm font-medium text-white">Verified Artist</span>
                        </div>
                    )}

                    {/* Artist Name */}
                    <h1 className="text-7xl font-black text-white mb-4 drop-shadow-lg">
                        {artist.stageName || artist.name}
                    </h1>

                    {/* Stats */}
                    <div className="text-white text-sm font-medium">
                        <span>64,540,188 monthly listeners</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 px-8 mt-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('albums')}
                            className={`pb-3 px-1 font-semibold transition-colors relative ${activeTab === 'albums'
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Albums
                            {activeTab === 'albums' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('songs')}
                            className={`pb-3 px-1 font-semibold transition-colors relative ${activeTab === 'songs'
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Songs
                            {activeTab === 'songs' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                            )}
                        </button>
                    </div>
                    {/* Follow Button */}
                    <button
                        onClick={handleFollowToggle}
                        className={`px-6 py-1.5 rounded-full text-sm font-semibold mb-3 border transition-colors ${
                            isFollowing 
                            ? 'border-white text-white hover:border-gray-400 hover:text-gray-400' 
                            : 'border-white text-white hover:scale-105'
                        }`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'albums' && (
                <div className="px-8 mt-6">
                    <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
                    <p className="text-gray-400">Coming soon - Album listings will appear here</p>
                </div>
            )}

            {activeTab === 'songs' && (
                <div className="px-8 mt-6">
                    <h2 className="text-xl font-bold text-white mb-4">Popular Songs</h2>
                    {songs.length === 0 ? (
                        <p className="text-gray-400">No songs available</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {songs.map((song) => (
                                <ItemCard
                                    key={song.id}
                                    item={{
                                        id: song.id,
                                        title: song.title,
                                        artist: artist.stageName || artist.name,
                                        type: 'track',
                                        img: song.coverImageUrl || `https://picsum.photos/seed/${song.songId}/150/150`,
                                        audioUrl: `/api/stream/song/${song.songId}`,
                                        duration: song.duration
                                    }}
                                    onClick={() => onSongClick({
                                        id: song.songId,
                                        title: song.title,
                                        artist: artist.stageName || artist.name,
                                        audioUrl: `/api/stream/song/${song.songId}`,
                                        duration: song.duration
                                    })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArtistDetail;
