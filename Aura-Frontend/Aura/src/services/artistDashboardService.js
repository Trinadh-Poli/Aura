import api from './api';

const artistDashboardService = {
    // Create a new album
    createAlbum: async (albumData) => {
        try {
            const formData = new FormData();
            formData.append('title', albumData.title);
            formData.append('releaseYear', albumData.releaseYear);
            formData.append('artistId', albumData.artistId);
            if (albumData.coverImage) {
                formData.append('coverImage', albumData.coverImage);
            }

            const response = await api.post('/artist/albums', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, album: response.data };
        } catch (error) {
            console.error('Failed to create album:', error);
            return { success: false, error: 'Failed to create album' };
        }
    },

    // Get all albums for an artist
    getMyAlbums: async (artistId) => {
        try {
            const response = await api.get(`/artist/albums/artist/${artistId}`);
            return { success: true, albums: response.data };
        } catch (error) {
            console.error('Failed to fetch albums:', error);
            return { success: false, error: 'Failed to fetch albums' };
        }
    },

    // Upload a song to an album
    uploadSong: async (albumId, songData) => {
        try {
            const formData = new FormData();
            formData.append('title', songData.title);
            formData.append('genre', songData.genre);
            formData.append('duration', songData.duration || 0);
            formData.append('songFile', songData.songFile);

            // Backend DTO requires coverImage even if it's in an album
            // We can reuse the album cover or require a new one. 
            // For now, we assume the UI provides it.
            if (songData.coverImage) {
                formData.append('coverImage', songData.coverImage);
            }

            const response = await api.post(`/artist/songs/album/${albumId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { success: true, song: response.data };
        } catch (error) {
            console.error('Failed to upload song:', error);
            return { success: false, error: 'Failed to upload song' };
        }
    },

    // Get songs by album
    getAlbumSongs: async (albumId) => {
        try {
            const response = await api.get(`/artist/songs/album/${albumId}`);
            return { success: true, songs: response.data };
        } catch (error) {
            console.error('Failed to fetch album songs:', error);
            return { success: false, error: 'Failed to fetch album songs' };
        }
    }
};

export default artistDashboardService;
