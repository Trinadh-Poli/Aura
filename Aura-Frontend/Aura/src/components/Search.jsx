import { Disc, Mic2, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '../services/searchService';
import ItemCard from './ItemCard';
import { BASE_URL } from '../services/api';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const hostUrl = BASE_URL.replace('/api', '');
    return `${hostUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

const Search = ({ searchQuery, onSongClick }) => {
    const navigate = useNavigate();
    const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    // Debounce search query to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedQuery && debouncedQuery.trim().length > 0) {
            performSearch(debouncedQuery);
        } else {
            setResults({ songs: [], artists: [], albums: [] });
        }
    }, [debouncedQuery]);

    const performSearch = async (query) => {
        setLoading(true);
        const result = await searchService.searchAll(query);
        if (result.success) {
            setResults(result.results);
        }
        setLoading(false);
    };

    if (!searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Music size={64} className="mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-white mb-2">Search Aura</h2>
                <p>Find songs, artists, and albums</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-white">Searching...</div>;
    }

    const hasResults = results.songs?.length > 0 || results.artists?.length > 0 || results.albums?.length > 0;

    if (!hasResults && searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>No results found for "{searchQuery}"</p>
            </div>
        );
    }

    return (
        <div className="p-8 pb-32 overflow-y-auto h-full">
            {/* Songs Section */}
            {results.songs?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Music size={24} />
                        Songs
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {results.songs.map((song) => (
                            <ItemCard
                                key={song.songId}
                                item={{
                                    id: song.songId,
                                    title: song.title,
                                    artist: song.artistName || 'Unknown Artist', // Backend might need to return artistName
                                    img: song.coverImageUrl,
                                    type: 'song'
                                }}
                                onClick={() => onSongClick({
                                    id: song.songId,
                                    title: song.title,
                                    artist: song.artistName || 'Unknown Artist',
                                    coverImageUrl: song.coverImageUrl,
                                    audioUrl: `/api/stream/song/${song.songId}`
                                })}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Artists Section */}
            {results.artists?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Mic2 size={24} />
                        Artists
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {results.artists.map((artist) => (
                            <div
                                key={artist.artistId}
                                onClick={() => navigate(`/artists/${artist.artistId}`)}
                                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group"
                            >
                                <div className="mb-4 relative aspect-square">
                                    <img
                                        src={getImageUrl(artist.profileImageUrl) || getImageUrl(artist.headerImageUrl) || `https://loremflickr.com/400/400/${encodeURIComponent(artist.stageName || artist.name).toLowerCase().replace(/%20/g, '')},singer/all`}
                                        alt={artist.stageName}
                                        className="w-full h-full object-cover rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-white font-bold truncate text-center">{artist.stageName}</h3>
                                <p className="text-gray-400 text-sm text-center">Artist</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Albums Section */}
            {results.albums?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Disc size={24} />
                        Albums
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {results.albums.map((album) => (
                            <ItemCard
                                key={album.albumId}
                                item={{
                                    id: album.albumId,
                                    title: album.title,
                                    artist: album.artistName || 'Unknown Artist',
                                    img: album.coverImageUrl,
                                    type: 'album'
                                }}
                                onClick={() => navigate(`/albums/${album.albumId}`)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Search;
