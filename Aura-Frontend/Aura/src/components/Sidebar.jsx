import { useEffect, useState, useRef } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import { libraryNav, mainNav } from './mockData';
import playlistService from '../services/playlistService';
import authService from '../services/authService';

const Sidebar = ({ onClearSearch, compact = false }) => {
    const location = useLocation();
    const [userPlaylists, setUserPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (authService.isAuthenticated()) {
                const userRes = await authService.getCurrentUser();
                if (userRes.success && userRes.user) {
                    const res = await playlistService.getUserPlaylists(userRes.user.id);
                    if (res.success) {
                        setUserPlaylists(res.playlists);
                    }
                }
            }
        };
        fetchPlaylists();

        window.addEventListener('playlistsUpdated', fetchPlaylists);
        return () => window.removeEventListener('playlistsUpdated', fetchPlaylists);
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const toggleCreateModal = () => {
        setShowCreateModal(!showCreateModal);
        setNewPlaylistName('');
    }

    const handleCreateSubmit = async () => {
        if (!newPlaylistName.trim()) return;
        if (authService.isAuthenticated()) {
            const userRes = await authService.getCurrentUser();
            if (userRes.success && userRes.user) {
                const res = await playlistService.createPlaylist(userRes.user.id, {
                    title: newPlaylistName,
                    description: '',
                    isPublic: true
                });
                if (res.success) {
                    const plRes = await playlistService.getUserPlaylists(userRes.user.id);
                    if (plRes.success) {
                        setUserPlaylists(plRes.playlists);
                        window.dispatchEvent(new Event('playlistsUpdated'));
                    }
                    toggleCreateModal();
                }
            }
        }
    };

    const renderCreateModal = () => {
        if (!showCreateModal) return null;
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto" onClick={toggleCreateModal}>
                <div 
                    className="w-[360px] bg-[#282828] border border-[#3e3e3e] shadow-2xl rounded-xl p-5 flex flex-col gap-4 font-sans"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center text-white font-bold text-lg">
                        Create New Playlist
                        <button onClick={toggleCreateModal} className="text-gray-400 hover:text-white transition"><X size={20}/></button>
                    </div>
                    <input 
                       autoFocus
                       type="text" 
                       value={newPlaylistName}
                       onChange={e => setNewPlaylistName(e.target.value)}
                       className="w-full bg-[#3e3e3e] text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm mb-2" 
                       placeholder="My Awesome Playlist"
                       onKeyDown={e => { if(e.key === 'Enter') handleCreateSubmit() }}
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={toggleCreateModal} className="text-sm font-bold text-gray-300 hover:text-white px-4 py-2 hover:bg-[#3e3e3e] rounded-full transition">Cancel</button>
                        <button onClick={handleCreateSubmit} className="text-sm font-bold bg-white text-black rounded-full px-6 py-2 hover:scale-105 transition">Done</button>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className={`spotify-sidebar-container ${compact ? 'sidebar-compact' : 'sidebar-full'}`}>
            {/* Primary Navigation */}
            <nav className="w-full shrink-0">
                <NavItem
                    key={mainNav[0].name}
                    icon={mainNav[0].icon}
                    name={compact ? '' : mainNav[0].name}
                    active={mainNav[0].route === location.pathname}
                    route={mainNav[0].route}
                    onClick={onClearSearch}
                    compact={compact}
                />
                
                {/* Swapped + Button */}
                {compact ? (
                    <div className="w-full flex justify-center shrink-0 py-3">
                        <button 
                            onClick={toggleCreateModal}
                            className="bg-[#2a2a2a] hover:bg-[#3f3f3f] text-gray-400 hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg"
                            title="Create Playlist"
                        >
                            <Plus size={20} strokeWidth={2} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={toggleCreateModal}
                        className="flex items-center gap-4 text-gray-400 hover:text-white font-semibold text-sm px-6 py-3 transition group w-full text-left shrink-0 nav-item hover:bg-[#1a1a1a] rounded-md mx-2 w-[calc(100%-16px)]"
                    >
                        <div className="bg-gray-400 group-hover:bg-white text-black rounded-sm w-6 h-6 flex items-center justify-center transition-colors">
                            <Plus size={16} strokeWidth={3} />
                        </div>
                        <span>Create Playlist</span>
                    </button>
                )}
            </nav>

            {/* Scrollable Library & Playlists Section */}
            <div className={`w-full flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden ${compact ? 'flex flex-col items-center' : 'flex flex-col'}`}>
                {/* Library Section */}
                {!compact && (
                    <div className="flex flex-col w-full shrink-0 border-t border-[#242424] pt-4 mt-2">
                        <h3 className="section-header sidebar-section-header w-full">LIBRARY</h3>
                        <nav className="w-full mb-4">
                            {libraryNav.map((item) => (
                                <NavItem
                                    key={item.name}
                                    icon={item.icon}
                                    name={item.name}
                                    active={item.route === location.pathname}
                                    route={item.route}
                                />
                            ))}
                        </nav>
                    </div>
                )}

                {compact && (
                    <nav className="w-full shrink-0 border-t border-[#242424] pt-4 mt-2 gap-2 flex flex-col items-center mb-4">
                        {libraryNav.map((item) => (
                            <NavItem
                                key={item.name}
                                icon={item.icon}
                                name=""
                                active={item.route === location.pathname}
                                route={item.route}
                                compact={true}
                            />
                        ))}
                    </nav>
                )}

                {/* Playlists Header */}
                {!compact && (
                    <div className="flex items-center justify-between section-header sidebar-section-header group pr-4 relative">
                        <h3>PLAYLISTS</h3>
                    </div>
                )}
                
                {renderCreateModal()}

                <nav className={`w-full flex flex-col ${compact ? 'items-center gap-2 pb-6' : 'pb-6'}`}>
                    {userPlaylists.map((playlist) => {
                        if (compact) {
                            return (
                                <a key={playlist.playlistId} href={`/playlists/${playlist.playlistId}`} className="block relative group hover:scale-105 transition shrink-0">
                                    <img 
                                        src={playlist.coverImageUrl || `https://picsum.photos/seed/${playlist.playlistId}/50/50`} 
                                        alt={playlist.title || playlist.name} 
                                        className="w-12 h-12 rounded object-cover"
                                        title={playlist.title || playlist.name}
                                    />
                                    {location.pathname === `/playlists/${playlist.playlistId}` && (
                                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#1ed760] outline outline-2 outline-black"></div>
                                    )}
                                </a>
                            );
                        } else {
                            return (
                                <NavItem
                                    key={playlist.playlistId}
                                    name={playlist.title}
                                    small
                                    active={`/playlists/${playlist.playlistId}` === location.pathname}
                                    route={`/playlists/${playlist.playlistId}`}
                                />
                            );
                        }
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;