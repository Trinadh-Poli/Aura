import React from 'react';

const ItemCard = ({ item, onClick }) => {
  return (
    <div 
      className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div 
          className="w-full aspect-square bg-gray-700 rounded-md flex items-center justify-center text-white text-4xl font-bold"
        >
          {item.title ? item.title.charAt(0) : '?'}
        </div>
      </div>
      <div className="text-white font-bold mb-1 truncate">
        {item.title || 'Unknown Title'}
      </div>
      <div className="text-gray-400 text-sm truncate">
        {item.artist || 'Unknown Artist'}
      </div>
    </div>
  );
};

export default ItemCard;
