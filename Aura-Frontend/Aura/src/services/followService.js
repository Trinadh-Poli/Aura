import api from './api';

const followService = {
    // Follow a user
    follow: async (userId) => {
        try {
            const response = await api.post(`/follow/user/${userId}`);
            return {
                success: true,
                message: response.data.message || 'Successfully followed user'
            };
        } catch (error) {
            console.error('Follow failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to follow user'
            };
        }
    },

    // Unfollow a user
    unfollow: async (userId) => {
        try {
            const response = await api.delete(`/follow/user/${userId}`);
            return {
                success: true,
                message: response.data.message || 'Successfully unfollowed user'
            };
        } catch (error) {
            console.error('Unfollow failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to unfollow user'
            };
        }
    },

    // Check if following a user
    isFollowing: async (userId) => {
        try {
            const response = await api.get(`/follow/check/${userId}`);
            return {
                success: true,
                isFollowing: response.data.isFollowing || false
            };
        } catch (error) {
            console.error('Check following failed:', error);
            return {
                success: false,
                isFollowing: false,
                error: error.response?.data?.message || 'Failed to check follow status'
            };
        }
    },

    // Get list of followers for a user
    getFollowers: async (userId, page = 0, size = 20) => {
        try {
            const response = await api.get(`/follow/followers/${userId}`);
            return {
                success: true,
                followers: response.data.content || response.data || [],
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages
            };
        } catch (error) {
            console.error('Get followers failed:', error);
            return {
                success: false,
                followers: [],
                error: error.response?.data?.message || 'Failed to fetch followers'
            };
        }
    },

    // Get list of users that a user is following
    getFollowing: async (userId, page = 0, size = 20) => {
        try {
            const response = await api.get(`/follow/following/${userId}`);
            return {
                success: true,
                following: response.data.content || response.data || [],
                totalElements: response.data.totalElements,
                totalPages: response.data.totalPages
            };
        } catch (error) {
            console.error('Get following failed:', error);
            return {
                success: false,
                following: [],
                error: error.response?.data?.message || 'Failed to fetch following'
            };
        }
    },

    // Get follower/following stats for a user
    getFollowStats: async (userId) => {
        try {
            const response = await api.get(`/follow/stats/${userId}`);
            return {
                success: true,
                stats: {
                    followerCount: response.data.followerCount || 0,
                    followingCount: response.data.followingCount || 0
                }
            };
        } catch (error) {
            console.error('Get follow stats failed:', error);
            return {
                success: false,
                stats: {
                    followerCount: 0,
                    followingCount: 0
                },
                error: error.response?.data?.message || 'Failed to fetch follow stats'
            };
        }
    },

    // Follow an artist
    followArtist: async (artistId) => {
        try {
            const response = await api.post(`/follow/artist/${artistId}`);
            return {
                success: true,
                message: response.data.message || 'Successfully followed artist'
            };
        } catch (error) {
            console.error('Follow artist failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to follow artist'
            };
        }
    },

    // Unfollow an artist
    unfollowArtist: async (artistId) => {
        try {
            const response = await api.delete(`/follow/artist/${artistId}`);
            return {
                success: true,
                message: response.data.message || 'Successfully unfollowed artist'
            };
        } catch (error) {
            console.error('Unfollow artist failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to unfollow artist'
            };
        }
    },

    // Check if following an artist
    isFollowingArtist: async (artistId) => {
        try {
            const response = await api.get(`/follow/artist/${artistId}/check`);
            return {
                success: true,
                isFollowing: response.data.isFollowing || false
            };
        } catch (error) {
            console.error('Check following artist failed:', error);
            return {
                success: false,
                isFollowing: false,
                error: error.response?.data?.message || 'Failed to check follow status'
            };
        }
    },
};

export default followService;
