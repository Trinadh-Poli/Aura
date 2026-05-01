import api from './api';

const searchService = {
    // General search for all categories
    searchAll: async (query) => {
        try {
            const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
            return { success: true, results: response.data };
        } catch (error) {
            console.error('Search failed:', error);
            return { success: false, error: 'Search failed' };
        }
    },

    // Search specific categories
    searchSongs: async (query) => {
        try {
            const response = await api.get(`/search/songs?query=${encodeURIComponent(query)}`);
            return { success: true, songs: response.data };
        } catch (error) {
            console.error('Song search failed:', error);
            return { success: false, error: 'Song search failed' };
        }
    },

    searchArtists: async (query) => {
        try {
            const response = await api.get(`/search/artists?query=${encodeURIComponent(query)}`);
            return { success: true, artists: response.data };
        } catch (error) {
            console.error('Artist search failed:', error);
            return { success: false, error: 'Artist search failed' };
        }
    },

    searchAlbums: async (query) => {
        try {
            const response = await api.get(`/search/albums?query=${encodeURIComponent(query)}`);
            return { success: true, albums: response.data };
        } catch (error) {
            console.error('Album search failed:', error);
            return { success: false, error: 'Album search failed' };
        }
    },

    // Get trending/recent
    getTrending: async () => {
        try {
            const response = await api.get('/search/trending');
            return { success: true, results: response.data };
        } catch (error) {
            console.error('Fetch trending failed:', error);
            return { success: false, error: 'Failed to fetch trending content' };
        }
    }
};

export default searchService;
