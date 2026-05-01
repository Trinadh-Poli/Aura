import api from './api';

const playlistService = {
  // Get all playlists for a user
  getUserPlaylists: async (userId) => {
    try {
      const response = await api.get(`/playlists/user/${userId}`);
      return { success: true, playlists: response.data };
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
      return { success: false, error: 'Failed to fetch playlists', playlists: [] };
    }
  },

  // Get playlist by ID  
  getPlaylistById: async (playlistId) => {
    try {
      const response = await api.get(`/playlists/${playlistId}`);
      return { success: true, playlist: response.data };
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
      return { success: false, error: 'Failed to fetch playlist' };
    }
  },

  // Create new playlist
  createPlaylist: async (userId, playlistData) => {
    try {
      const response = await api.post(`/playlists`, playlistData);
      return { success: true, playlist: response.data };
    } catch (error) {
      console.error('Failed to create playlist:', error);
      return { success: false, error: 'Failed to create playlist' };
    }
  },

  // Update playlist
  updatePlaylist: async (playlistId, playlistData) => {
    try {
      const response = await api.put(`/playlists/${playlistId}`, playlistData);
      return { success: true, playlist: response.data };
    } catch (error) {
      console.error('Failed to update playlist:', error);
      return { success: false, error: 'Failed to update playlist' };
    }
  },

  // Delete playlist
  deletePlaylist: async (playlistId) => {
    try {
      await api.delete(`/playlists/${playlistId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      return { success: false, error: 'Failed to delete playlist' };
    }
  },

  // Add song to playlist
  addSongToPlaylist: async (playlistId, songId) => {
    try {
      const response = await api.post(`/playlists/${playlistId}/songs/${songId}`);
      return { success: true, playlist: response.data };
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      return { success: false, error: 'Failed to add song to playlist' };
    }
  },

  // Remove song from playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    try {
      const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
      return { success: true, playlist: response.data };
    } catch (error) {
      console.error('Failed to remove song from playlist:', error);
      return { success: false, error: 'Failed to remove song from playlist' };
    }
  },
};

export default playlistService;
