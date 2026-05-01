import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import artistService from '../services/artistService';
import { BASE_URL } from '../services/api';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const hostUrl = BASE_URL.replace('/api', '');
    return `${hostUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        setLoading(true);
        const result = await artistService.getAllArtists();

        if (result.success) {
            setArtists(result.artists);
        } else {
            console.error('Failed to fetch artists:', result.error);
        }

        setLoading(false);
    };

    const filteredArtists = searchQuery
        ? artists.filter(artist =>
            (artist.stageName || artist.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
        : artists;

    if (loading) {
        return <div className="text-white p-8">Loading artists...</div>;
    }

    return (
        <div className="p-8 overflow-y-auto" style={{ height: 'calc(100vh - 170px)' }}>
            <section>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Artists</h2>
                    <p className="text-gray-400">Discover amazing artists</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search artists..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 bg-[#2c2c2c] text-white border border-gray-600 rounded-md focus:outline-none focus:border-white"
                    />
                </div>

                {/* Artists Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredArtists.map((artist) => {
                        const displayName = artist.stageName || artist.name || 'Unknown Artist';
                        const artistId = artist.artistId || artist.id;
                        return (
                            <div
                                key={artistId}
                                onClick={() => navigate(`/artists/${artistId}`)}
                                className="item-card cursor-pointer group"
                            >
                                <div className="item-card-image-wrapper rounded-full overflow-hidden aspect-square mb-4">
                                    <img
                                        src={getImageUrl(artist.profileImageUrl) || getImageUrl(artist.headerImageUrl) || `https://loremflickr.com/400/400/${encodeURIComponent(displayName).toLowerCase().replace(/%20/g, '')},singer/all`}
                                        alt={displayName}
                                        className="item-card-image group-hover:scale-105 transition-transform duration-300 object-cover"
                                    />
                                </div>
                                <div className="item-card-details text-center">
                                    <h3 className="item-card-title">{displayName}</h3>
                                    <p className="item-card-artist">Artist</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredArtists.length === 0 && (
                    <p className="text-gray-400 mt-8">No artists found</p>
                )}
            </section>
        </div>
    );
};

export default ArtistList;
