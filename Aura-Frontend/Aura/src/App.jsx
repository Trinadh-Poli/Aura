import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AccountSettings from './components/AccountSettings';
import ArtistDashboard from './components/ArtistDashboard';
import ArtistDetail from './components/ArtistDetail';
import ArtistList from './components/ArtistList';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/ForgotPassword';
import Header from './components/Header';
import Home from './components/Home';
import Landing from './components/Landing';
import Login from './components/Login';
import NowPlayingPanel from './components/NowPlayingPanel';
import Player from './components/Player';
import PlaylistDetail from './components/PlaylistDetail';
import PlaylistList from './components/PlaylistList';
import Profile from './components/Profile';
import Register from './components/Register';
import RecentlyPlayed from './components/RecentlyPlayed';
import ResetPassword from './components/ResetPassword';
import Search from './components/Search';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfile';
import VerifyEmail from './components/VerifyEmail';
import './styles.css';

// Main app layout with 3-panel card design
const MainLayout = ({ children, currentSong, onSearch, searchQuery, onClearSearch }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/home') {
      onClearSearch();
    }
  }, [location.pathname, onClearSearch]);

  return (
    <div className="app-main-container">
      {/* Header Bar */}
      <div className="app-header-bar">
        <Header onSearch={onSearch} searchQuery={searchQuery} />
      </div>

      {/* 3-Column Card Layout */}
      <div className="cards-container">
        {/* Left Card - Sidebar */}
        <div className="left-card">
          <Sidebar onClearSearch={onClearSearch} compact={true} />
        </div>

        {/* Middle Card - Main Content */}
        <div className="middle-card">
          {children}
        </div>

        {/* Right Card - Now Playing */}
        <div className="right-card">
          <NowPlayingPanel currentSong={currentSong} />
        </div>
      </div>

      {/* Player Fixed at Bottom */}
      <div className="player-container">
        <Player song={currentSong} />
      </div>
    </div>
  );
};

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone routes (no layout) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Main app routes with 3-panel layout */}
        <Route path="/home" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><Home onSongClick={playSong} searchQuery={searchQuery} /></MainLayout>} />
        <Route path="/browse" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><Home onSongClick={playSong} searchQuery={searchQuery} /></MainLayout>} />
        <Route path="/search" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><Search onSongClick={playSong} searchQuery={searchQuery} /></MainLayout>} />
        <Route path="/recent" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><RecentlyPlayed /></MainLayout>} />
        <Route path="/profile" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><Profile /></MainLayout>} />
        <Route path="/user/:userId" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><UserProfile /></MainLayout>} />
        <Route path="/edit-profile" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><EditProfile /></MainLayout>} />
        <Route path="/settings" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><AccountSettings /></MainLayout>} />
        <Route path="/playlists" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><PlaylistList /></MainLayout>} />
        <Route path="/playlists/:id" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><PlaylistDetail onSongClick={playSong} /></MainLayout>} />
        <Route path="/artists" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><ArtistList /></MainLayout>} />
        <Route path="/artists/:id" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><ArtistDetail onSongClick={playSong} /></MainLayout>} />
        <Route path="/artist/dashboard" element={<MainLayout currentSong={currentSong} onSearch={handleSearch} onClearSearch={clearSearch} searchQuery={searchQuery}><ArtistDashboard /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;