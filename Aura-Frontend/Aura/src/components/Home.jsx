import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import artistService from '../services/artistService';
import songService from '../services/songService';
import VerifiedBadge from './VerifiedBadge';

const Home = ({ onSongClick, searchQuery }) => {
  const navigate = useNavigate();
  const [allSongs, setAllSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      // No search - show all songs
      setFilteredSongs(allSongs);
      setFilteredArtists([]);
    }
  }, [searchQuery, allSongs]);

  const fetchSongs = async () => {
    const [allResult, trendingResult, recentResult] = await Promise.all([
      songService.getAllSongs(),
      songService.getTrendingSongs(),
      songService.getRecentSongs()
    ]);

    if (allResult.success) {
      const transformedSongs = allResult.songs.map(songService.transformSongData);
      setAllSongs(transformedSongs);
      setFilteredSongs(transformedSongs);
    }
    
    if (trendingResult.success) {
      setTrendingSongs(trendingResult.songs.map(songService.transformSongData));
    }

    if (recentResult.success) {
      setRecentSongs(recentResult.songs.map(songService.transformSongData));
    }

    setLoading(false);
  };

  const performSearch = async (query) => {
    setLoading(true);

    // Search both songs and artists in parallel
    const [songsResult, artistsResult] = await Promise.all([
      songService.searchSongs(query),
      artistService.searchArtists(query)
    ]);

    if (songsResult.success) {
      const transformedSongs = songsResult.songs.map(songService.transformSongData);
      setFilteredSongs(transformedSongs);
    } else {
      // Fallback to client-side filtering
      const filtered = allSongs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredSongs(filtered);
    }

    // Set artist results
    if (artistsResult.success) {
      console.log('Artist search results:', artistsResult.artists);
      setFilteredArtists(artistsResult.artists);
    } else {
      console.log('Artist search failed:', artistsResult);
      setFilteredArtists([]);
    }

    setLoading(false);
  };

  const handleArtistClick = (artist) => {
    // Navigate based on artist type
    if (artist.userId) {
      // Creator artist - has user account
      navigate(`/user/${artist.userId}`);
    } else {
      // Catalog artist - no user account
      navigate(`/artists/${artist.artistId}`);
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading songs...</div>;
  }

  const displaySongs = searchQuery ? filteredSongs : trendingSongs;

  return (
    <div className="p-8 overflow-y-auto" style={{ height: 'calc(100vh - 170px)' }}>
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-gray-400">
            Found {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'}
            {filteredArtists.length > 0 && ` and ${filteredArtists.length} ${filteredArtists.length === 1 ? 'artist' : 'artists'}`}
          </p>
        </div>
      )}

      {/* Artists Section - only show when searching */}
      {searchQuery && filteredArtists.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredArtists.map((artist) => (
              <div
                key={artist.artistId}
                onClick={() => handleArtistClick(artist)}
                className="artist-card group cursor-pointer bg-[#1a1a1a] p-4 rounded-lg hover:bg-[#282828] transition-all duration-200"
              >
                <div className="relative mb-4">
                  <img
                    src={artist.profileImageUrl || `https://picsum.photos/seed/${artist.artistId || 'artist'}/300/300`}
                    alt={artist.stageName}
                    className="w-full aspect-square object-cover rounded-full shadow-lg"
                  />
                </div>
                <h3 className="font-semibold text-white truncate flex items-center gap-2">
                  {artist.stageName || artist.name}
                  {!artist.userId && <VerifiedBadge size={16} />}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {!artist.userId ? 'Official Artist' : 'Artist'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {searchQuery ? `Results for "${searchQuery}"` : 'Songs'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
          {displaySongs.map(song => (
            <div
              key={song.id}
              onClick={() => onSongClick(song)}
              className="group cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-all"
            >
              {/* Album Cover */}
              <div className="relative mb-2">
                <img
                  src={song.img || `https://picsum.photos/seed/${song.id}/300/300`}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md shadow-lg"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${song.id || 'default'}/300/300`;
                  }}
                />
                {/* Play button overlay on hover */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Song Info */}
              <div>
                <h3 className="font-semibold text-white truncate text-base">{song.title}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
        {displaySongs.length === 0 && (
          <p className="text-gray-400">No songs found matching your search</p>
        )}
      </section>

      {
        !searchQuery && recentSongs.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-2">Made for you</h2>
            <p className="text-gray-400 mb-6">Inspired by your recent activity.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
              {recentSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => onSongClick(song)}
                  className="group cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-all"
                >
                  {/* Album Cover */}
                  <div className="relative mb-2">
                    <img
                      src={song.img || `https://picsum.photos/seed/${song.id}/300/300`}
                      alt={song.title}
                      className="w-full aspect-square object-cover rounded-md shadow-lg"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${song.id || 'default'}/300/300`;
                      }}
                    />
                    {/* Play button overlay on hover */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Song Info */}
                  <div>
                    <h3 className="font-semibold text-white truncate text-base">{song.title}</h3>
                    <p className="text-sm text-white truncate">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      }
    </div >
  );
};

export default Home;
