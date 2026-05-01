import { useEffect, useState } from 'react';
import songService from '../services/songService';

const RecentlyPlayed = () => {
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      const result = await songService.getRecentSongs();
      if (result.success) {
        setRecentSongs(result.songs.map(songService.transformSongData));
      }
      setLoading(false);
    };
    fetchRecent();
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading recent songs...</div>;
  }

  return (
    <div className="p-8 overflow-y-auto" style={{ height: 'calc(100vh - 170px)' }}>
      <h2 className="text-3xl font-bold text-white mb-2">Recently Played</h2>
      <p className="text-gray-400 mb-6">Your most recently discovered tracks.</p>

      {recentSongs.length === 0 ? (
        <p className="text-gray-400">No recent songs found.</p>
      ) : (
        <div className="flex flex-col gap-2 relative z-10">
          <div className="grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="text-right">Time</div>
          </div>
          
          <div className="flex flex-col gap-1 pb-32">
            {recentSongs.map((song, index) => (
              <div 
                key={song.id}
                className="grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)] gap-4 items-center px-4 py-2 hover:bg-white/10 rounded-md group cursor-pointer transition-colors"
                onClick={() => {
                  // The click logic can be handled if this was wrapped in a way to play it 
                  // or pass a prop. For simplicity, we just display it here.
                }}
              >
                <div className="text-sm text-gray-400 group-hover:text-white">
                  {index + 1}
                </div>
                
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={song.img} alt={song.title} className="w-10 h-10 object-cover rounded" />
                  <div className="truncate">
                    <div className="text-white text-base truncate">{song.title}</div>
                    <div className="text-sm text-gray-400 group-hover:text-white truncate">{song.artist}</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 group-hover:text-white truncate">
                  {song.album || 'Single'}
                </div>
                
                <div className="text-sm text-gray-400 text-right">
                  {/* Mock duration format since it's hardcoded usually */}
                  3:00
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayed;
