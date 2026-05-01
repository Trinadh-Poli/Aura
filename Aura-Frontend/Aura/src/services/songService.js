import api from './api';

const songService = {
  // Get all songs (using search endpoint with empty query)
  getAllSongs: async () => {
    try {
      const response = await api.get('/search/songs?query=');
      console.log('Raw API response:', response.data); // DEBUG
      return { success: true, songs: response.data };
    } catch (error) {
      console.error('Failed to fetch songs:', error);
      return { success: false, error: 'Failed to fetch songs', songs: [] };
    }
  },

  // Search songs by title
  searchSongs: async (query) => {
    try {
      const response = await api.get(`/search/songs?query=${encodeURIComponent(query)}`);
      return { success: true, songs: response.data };
    } catch (error) {
      console.error('Failed to search songs:', error);
      return { success: false, error: 'Failed to search songs', songs: [] };
    }
  },

  // Get trending songs
  getTrendingSongs: async () => {
    try {
      const response = await api.get('/search/trending');
      return { success: true, songs: response.data };
    } catch (error) {
      console.error('Failed to fetch trending songs:', error);
      return { success: false, error: 'Failed to fetch trending songs', songs: [] };
    }
  },

  // Get recent songs
  getRecentSongs: async () => {
    try {
      const response = await api.get('/search/recent');
      return { success: true, songs: response.data };
    } catch (error) {
      console.error('Failed to fetch recent songs:', error);
      return { success: false, error: 'Failed to fetch recent songs', songs: [] };
    }
  },

  // Transform backend song data to match frontend format
  transformSongData: (backendSong) => {
    console.log('Transforming song:', backendSong); // DEBUG
    return {
      id: backendSong.songId,
      title: backendSong.title,
      artist: backendSong.artistName || 'Unknown Artist',
      album: backendSong.album || '',
      type: 'track',
      img: backendSong.coverImageUrl || `https://picsum.photos/seed/${backendSong.songId}/300/300`,
      audioUrl: `/api/stream/song/${backendSong.songId}`,
      duration: backendSong.duration || 0,
      artistId: backendSong.artistId,
      genre: backendSong.genre,
    };
  },
};

export default songService;
