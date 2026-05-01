import api from './api';

const artistService = {
  // Get all artists (using search endpoint as backend doesn't have /artists endpoint)
  getAllArtists: async () => {
    try {
      // Use search controller's artist endpoint
      const response = await api.get('/search/artists?query=');
      return { success: true, artists: response.data };
    } catch (error) {
      console.error('Failed to fetch artists:', error);
      return { success: false, error: 'Failed to fetch artists', artists: [] };
    }
  },

  // Search artists by name
  searchArtists: async (query) => {
    try {
      const response = await api.get(`/search/artists?query=${encodeURIComponent(query)}`);
      return { success: true, artists: response.data };
    } catch (error) {
      console.error('Failed to search artists:', error);
      return { success: false, error: 'Failed to search artists', artists: [] };
    }
  },

  // Get artist by ID (using search API since no dedicated endpoint exists)
  getArtistById: async (id) => {
    try {
      // Get all artists and find by ID
      const response = await api.get('/search/artists?query=');
      const artist = response.data.find(a => a.artistId === parseInt(id));
      if (artist) {
        return { success: true, artist };
      }
      return { success: false, error: 'Artist not found' };
    } catch (error) {
      console.error('Failed to fetch artist:', error);
      return { success: false, error: 'Failed to fetch artist' };
    }
  },

  // Get artist songs
  getArtistSongs: async (artistId) => {
    try {
      const response = await api.get(`/songs/artist/${artistId}`);
      return { success: true, songs: response.data };
    } catch (error) {
      console.error('Failed to fetch artist songs:', error);
      return { success: false, error: 'Failed to fetch songs', songs: [] };
    }
  },

  // Create new artist
  createArtist: async (artistData) => {
    try {
      const response = await api.post('/artists', artistData);
      return { success: true, artist: response.data };
    } catch (error) {
      console.error('Failed to create artist:', error);
      return { success: false, error: 'Failed to create artist' };
    }
  },
};

export default artistService;
