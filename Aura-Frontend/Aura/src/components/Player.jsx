import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2, VolumeX, Plus, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../services/api';
import playlistService from '../services/playlistService';
import authService from '../services/authService';

const Player = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());
  const [initialPlaylists, setInitialPlaylists] = useState(new Set());
  const audioRef = useRef(null);
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowPlaylistMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Only reload audio if it's a different song (by ID)
    if (song && song.id !== currentSongId && audioRef.current) {
      const audioUrl = song.audioUrl;
      const hostUrl = BASE_URL.replace('/api', '');
      const fullUrl = `${hostUrl}${audioUrl}`;

      console.log('Loading audio from:', fullUrl);
      audioRef.current.src = fullUrl;
      audioRef.current.load();
      setCurrentSongId(song.id);
      setIsPlaying(true);

      // Play and set up event listeners after load
      audioRef.current.play().catch(err => console.error('Play error:', err));
    }
  }, [song, currentSongId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      console.log('Time update:', audio.currentTime, audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => {
      console.log('Duration loaded:', audio.duration);
      setDuration(audio.duration);
    };
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => {
      console.log('Can play - duration:', audio.duration);
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlusClick = async () => {
    if (!showPlaylistMenu) { // about to open
        if (authService.isAuthenticated()) {
            const userRes = await authService.getCurrentUser();
            if (userRes.success && userRes.user) {
                const res = await playlistService.getUserPlaylists(userRes.user.id);
                if (res.success) {
                    setUserPlaylists(res.playlists);
                    const initialSet = new Set();
                    res.playlists.forEach(p => {
                        if (p.songs && p.songs.some(s => (s.songId || s.id) === song.id)) {
                            initialSet.add(p.playlistId);
                        }
                    });
                    setInitialPlaylists(initialSet);
                    setSelectedPlaylists(new Set(initialSet));
                }
            }
        }
    } else {
        // Clear search when closing
        setPlaylistSearchQuery('');
    }
    setShowPlaylistMenu(!showPlaylistMenu);
  };

  const handleCreatePlaylist = async () => {
    const name = window.prompt("Enter new playlist name", "New Playlist");
    if (name && authService.isAuthenticated()) {
        const userRes = await authService.getCurrentUser();
        if (userRes.success && userRes.user) {
            const res = await playlistService.createPlaylist(userRes.user.id, {
                title: name,
                description: '',
                isPublic: true
            });
            if (res.success) {
                const newPlaylist = res.playlist;
                setUserPlaylists([...userPlaylists, newPlaylist]);
                const newSelected = new Set(selectedPlaylists);
                newSelected.add(newPlaylist.playlistId);
                setSelectedPlaylists(newSelected);
                window.dispatchEvent(new Event('playlistsUpdated'));
            }
        }
    }
  };

  const togglePlaylistSelection = (playlistId) => {
    const newSelected = new Set(selectedPlaylists);
    if (newSelected.has(playlistId)) {
        newSelected.delete(playlistId);
    } else {
        newSelected.add(playlistId);
    }
    setSelectedPlaylists(newSelected);
  };

  const handleDone = async () => {
    const addedTo = [];
    const removedFrom = [];
    
    userPlaylists.forEach(p => {
        const id = p.playlistId;
        const wasIn = initialPlaylists.has(id);
        const isIn = selectedPlaylists.has(id);
        
        if (!wasIn && isIn) addedTo.push(id);
        if (wasIn && !isIn) removedFrom.push(id);
    });
    
    // Execute removals
    for (const id of removedFrom) {
        await playlistService.removeSongFromPlaylist(id, song.id);
    }
    // Execute additions
    for (const id of addedTo) {
        await playlistService.addSongToPlaylist(id, song.id);
    }
    
    window.dispatchEvent(new Event('playlistsUpdated'));
    
    setShowPlaylistMenu(false);
    setPlaylistSearchQuery('');
  };

  const renderPlaylistItem = (playlist) => {
      const isSelected = selectedPlaylists.has(playlist.playlistId);
      return (
          <div 
              key={playlist.playlistId} 
              className="flex justify-between items-center group py-2 hover:bg-[#3e3e3e] -mx-4 px-4 cursor-pointer"
              onClick={() => togglePlaylistSelection(playlist.playlistId)}
          >
              <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <img src={playlist.coverImageUrl || `https://picsum.photos/seed/${playlist.playlistId}/50/50`} alt="" className="w-12 h-12 rounded flex-shrink-0 object-cover" />
                  <div className="flex flex-col min-w-0">
                      <span className={`text-sm truncate font-semibold leading-tight mb-1 ${isSelected ? 'text-[#1ed760]' : 'text-white'}`}>{playlist.title || playlist.name}</span>
                      <span className="text-xs text-gray-400 truncate flex items-center gap-1">
                          📌 {playlist.songCount || 0} songs
                      </span>
                  </div>
              </div>
              <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-[#1ed760] bg-[#1ed760]' : 'border-gray-500 group-hover:border-white'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black"></div>}
                  </div>
              </div>
          </div>
      );
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Filter and split playlists
  const filteredPlaylists = userPlaylists.filter(p => !playlistSearchQuery || (p.title || p.name).toLowerCase().includes(playlistSearchQuery.toLowerCase()));
  const savedInPlaylists = filteredPlaylists.filter(p => initialPlaylists.has(p.playlistId));
  const otherPlaylists = filteredPlaylists.filter(p => !initialPlaylists.has(p.playlistId));

  if (!song) return null;

  return (
    <div className="player-container fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 z-50">
      <audio ref={audioRef} crossOrigin="anonymous" />

      <div className="flex items-center justify-between max-w-screen-2xl mx-auto gap-4">
        {/* Song Info Section with Album Cover */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Album Cover */}
          <img
            src={song.img || song.coverImageUrl || `https://picsum.photos/seed/${song.id}/80/80`}
            alt={song.title}
            className="w-14 h-14 rounded object-cover flex-shrink-0"
          />

          {/* Song Details */}
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">{song.title}</div>
            <div className="text-gray-400 text-xs truncate">{song.artist}</div>
          </div>

          {/* Add to Playlist Button */}
          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={handlePlusClick}
              className="text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800"
              title="Add to Playlist"
            >
              <Plus size={20} />
            </button>
            
            {showPlaylistMenu && (
              <div className="absolute bottom-full left-0 mb-4 w-72 bg-[#282828] rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <h3 className="text-white font-bold text-[15px]">Add to playlist</h3>
                    <button onClick={() => setShowPlaylistMenu(false)} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Search */}
                <div className="px-4 pb-3 border-b border-[#3e3e3e]">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Find a playlist"
                            className="w-full bg-[#3e3e3e] text-white text-sm rounded py-2 pl-9 pr-3 focus:outline-none placeholder-gray-400 font-semibold"
                            value={playlistSearchQuery}
                            onChange={e => setPlaylistSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="max-h-[340px] overflow-y-auto custom-scrollbar flex-1 pb-2">
                    {/* New Playlist Action */}
                    <button 
                        onClick={handleCreatePlaylist}
                        className="flex items-center gap-4 w-full px-4 py-3 hover:bg-[#3e3e3e] transition text-left group"
                    >
                        <div className="w-12 h-12 rounded bg-[#3e3e3e] group-hover:bg-[#4a4a4a] flex items-center justify-center transition">
                            <Plus size={24} className="text-gray-300 group-hover:text-white" />
                        </div>
                        <span className="text-white font-semibold flex-1 text-[15px]">New playlist</span>
                    </button>

                   {/* Render saved in */}
                   {savedInPlaylists.length > 0 && (
                       <div className="px-4 pt-2">
                           <h4 className="text-gray-400 text-sm font-bold mb-1">Saved in</h4>
                           {savedInPlaylists.map(p => renderPlaylistItem(p))}
                       </div>
                   )}
                   {/* Render other */}
                   {otherPlaylists.length > 0 && (
                       <div className="px-4 pt-4">
                           <h4 className="text-gray-400 text-sm font-bold mb-1">Recently updated</h4>
                           {otherPlaylists.map(p => renderPlaylistItem(p))}
                       </div>
                   )}
                   {userPlaylists.length > 0 && filteredPlaylists.length === 0 && (
                       <div className="px-4 py-6 text-center text-gray-400 text-sm">
                           No playlists found.
                       </div>
                   )}
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-[#282828] border-t border-[#3e3e3e] flex justify-end gap-2 shrink-0">
                    <button 
                        onClick={() => setShowPlaylistMenu(false)} 
                        className="text-white text-sm font-bold px-4 py-2 hover:scale-105 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDone}
                        className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
                    >
                        Done
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition">
              <Shuffle size={16} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" />}
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <SkipForward size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 min-w-[180px] w-[30%] justify-end">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
