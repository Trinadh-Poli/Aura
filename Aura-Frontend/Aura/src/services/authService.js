import api from './api';

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });

      // Backend returns { message: "Login successful", data: { token: "...", user: {...} } }
      const { token, id, username, email: userEmail } = response.data.data;

      // Store token and user in localStorage
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user', JSON.stringify({ id, username, email: userEmail }));

      return { success: true, token, user: { id, username, email: userEmail } };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Login failed'
      };
    }
  },

  // Register new user
  register: async (username, email, password) => {
    try {
      const response = await api.post('/users', {
        username,
        email,
        password,
      });

      // Backend returns { message: "...", user: {...} }
      return {
        success: true,
        message: response.data.message,
        user: response.data.user
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      };
    }
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await api.post('/users/verify-otp', {
        email,
        otp
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('OTP verification failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Verification failed'
      };
    }
  },

  // Resend OTP
  resendOtp: async (email) => {
    try {
      const response = await api.post('/users/resend-verification', {
        email
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Resend OTP failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resend code'
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Forgot password failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset link'
      };
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/users/reset-password', {
        token,
        newPassword
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Reset password failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reset password'
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      const response = await api.get(`/users/${user.id}`);
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch user' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('jwt_token');
  },

  // Get user profile
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Get profile failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Update profile failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Switch to artist
  switchToArtist: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/switch-to-artist`);
      return {
        success: true,
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      console.error('Switch to artist failed:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to switch to artist'
      };
    }
  },
};

export default authService;
