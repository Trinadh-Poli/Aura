import React, { useState } from 'react';
import './AuthWrapper.css';
import authService from './services/authService';

// ==================== ICON COMPONENTS ====================
const SpotifyLogo = () => (
  <svg className="w-12 h-12 mx-auto mb-8" viewBox="0 0 24 24" fill="white">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

// ==================== SIMPLE LOGIN VIEW ====================
const SimpleLoginView = ({ email, setEmail, password, setPassword, handleLogin, error, loading, setView }) => (
  <div className="space-y-6">
    <h1 className="text-white text-5xl font-bold text-center mb-8">
      Log in to Spotify
    </h1>

    {error && (
      <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
        {error}
      </div>
    )}

    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Username or Email
        </label>
        <input
          type="text"
          placeholder="Username or Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-[#121212] text-white border border-gray-600 rounded-md focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[#121212] text-white border border-gray-600 rounded-md focus:outline-none focus:border-white"
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-4 rounded-full transition-colors duration-200"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </div>

    <hr className="border-gray-700 my-8" />

    <div className="text-center">
      <p className="text-gray-400 mb-4">Don't have an account?</p>
      <button
        onClick={() => setView('signup')}
        className="w-full border border-gray-400 hover:border-white text-white font-bold py-3 px-4 rounded-full transition-colors duration-200"
      >
        Sign up for Spotify
      </button>
    </div>
  </div>
);

// ==================== SIMPLE SIGNUP VIEW ====================
const SimpleSignupView = ({ username, setUsername, email, setEmail, password, setPassword, handleSignup, error, loading, setView }) => (
  <div className="space-y-6">
    <h1 className="text-white text-5xl font-bold text-center mb-8">
      Sign up to start listening
    </h1>

    {error && (
      <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">
        {error}
      </div>
    )}

    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-[#121212] text-white border border-gray-600 rounded-md focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="name@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-[#121212] text-white border border-gray-600 rounded-md focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[#121212] text-white border border-gray-600 rounded-md focus:outline-none focus:border-white"
        />
      </div>

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-4 rounded-full transition-colors duration-200"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </div>

    <hr className="border-gray-700 my-8" />

    <div className="text-center">
      <p className="text-gray-400">
        Already have an account?{' '}
        <button
          onClick={() => setView('login')}
          className="text-white font-bold hover:text-green-500 underline"
        >
          Log in here
        </button>
      </p>
    </div>
  </div>
);

// ==================== MAIN AUTH WRAPPER ====================
const AuthWrapper = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both username/email and password');
      return;
    }

    setError('');
    setLoading(true);

    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success) {
      onAuthSuccess();
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    const result = await authService.register(username, email, password);
    setLoading(false);

    if (result.success) {
      // Auto-login after successful signup
      const loginResult = await authService.login(username, password);
      if (loginResult.success) {
        onAuthSuccess();
      } else {
        setError('Account created! Please log in.');
        setView('login');
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-content">
          <SpotifyLogo />

          {view === 'login' && (
            <SimpleLoginView
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              error={error}
              loading={loading}
              setView={setView}
            />
          )}

          {view === 'signup' && (
            <SimpleSignupView
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSignup={handleSignup}
              error={error}
              loading={loading}
              setView={setView}
            />
          )}
        </div>
      </div>
    </div>
  );
};

//export default AuthWrapper;
