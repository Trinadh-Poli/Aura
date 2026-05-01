import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import artistService from '../services/artistService';
import { BASE_URL } from '../services/api';
import './NowPlayingPanel.css';
import VerifiedBadge from './VerifiedBadge';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const hostUrl = BASE_URL.replace('/api', '');
    return `${hostUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const NowPlayingPanel = ({ currentSong }) => {
    const navigate = useNavigate();
    const [artistInfo, setArtistInfo] = useState(null);
    const [artistData, setArtistData] = useState(null);

    useEffect(() => {
        const fetchArtistData = async () => {
            if (currentSong?.artistId) {
                // Fetch full artist data to get profile image
                const result = await artistService.getArtistById(currentSong.artistId);
                if (result.success) {
                    setArtistData(result.artist);
                    setArtistInfo({
                        name: result.artist.stageName || result.artist.name,
                        bio: result.artist.bio || 'Artist biography and information will appear here.',
                        monthlyListeners: '61,966,694', // Placeholder, ideally fetched from artist data
                        profileImageUrl: getImageUrl(result.artist.profileImageUrl) || getImageUrl(result.artist.headerImageUrl),
                        isVerified: result.artist.isVerified
                    });
                } else {
                    // Fallback if artistId exists but fetching fails
                    setArtistInfo({
                        name: currentSong.artist,
                        bio: 'Artist biography and information will appear here. This section is scrollable for longer artist descriptions.',
                        monthlyListeners: '61,966,694',
                        profileImageUrl: null // No specific image if fetch failed
                    });
                }
            } else if (currentSong?.artist) {
                // Fallback if no artistId
                setArtistInfo({
                    name: currentSong.artist,
                    bio: 'Artist biography and information will appear here. This section is scrollable for longer artist descriptions.',
                    monthlyListeners: '61,966,694',
                    profileImageUrl: null // No specific image if no artistId
                });
            } else {
                setArtistInfo(null); // Clear artist info if no current song or artist
            }
        };
        fetchArtistData();
    }, [currentSong]);

    if (!currentSong) {
        return (
            <div className="now-playing-panel">
                <div className="no-song-playing">
                    <p className="text-gray-400">No song playing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="now-playing-panel py-4">
            {/* Album Cover Card */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden mb-4">
                <img
                    src={currentSong.coverImageUrl || `https://picsum.photos/seed/${currentSong.id || 'music'}/400/400`}
                    alt={currentSong.title}
                    className="w-full aspect-square object-cover"
                />
            </div>

            {/* Song Info */}
            <div className="mb-6">
                <h2 className="text-white text-2xl font-bold mb-1">{currentSong.title}</h2>
                <p
                    className="text-gray-400 text-sm hover:underline cursor-pointer"
                    onClick={() => currentSong.artistId && navigate(`/artists/${currentSong.artistId}`)}
                >
                    {currentSong.artist}
                </p>
            </div>

            {/* About the Artist Card */}
            {artistInfo && (
                <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
                    {/* Artist Image Background */}
                    <div
                        className="h-48 bg-cover bg-center relative"
                        style={{
                            backgroundImage: `url(${artistInfo.profileImageUrl || `https://picsum.photos/seed/${artistData?.artistId || currentSong.artist}/400/300`})`
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]" />
                    </div>

                    {/* Artist Info */}
                    <div className="p-6 -mt-8 relative">
                        <h3 className="text-white text-sm font-semibold mb-3">About the artist</h3>
                        <h2
                            className="text-white text-4xl font-bold mb-4 hover:underline cursor-pointer"
                            onClick={() => currentSong.artistId && navigate(`/artists/${currentSong.artistId}`)}
                        >
                            {artistInfo.name}
                        </h2>
                        {artistInfo.isVerified && (
                            <div className="flex items-center gap-1 mb-2">
                                <VerifiedBadge className="w-4 h-4" />
                                <span className="text-white text-xs font-semibold">Verified Artist</span>
                            </div>
                        )}
                        <p className="text-sm text-gray-300 mb-4">{artistInfo.monthlyListeners} monthly listeners</p>
                        <p className="text-sm text-gray-400 line-clamp-3">{artistInfo.bio}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NowPlayingPanel;
