import React from 'react';

const SocialButton = ({ text, icon, bgColor, textColor = 'text-white', isOutline = true, onClick }) => (
  <button
    className={`
      relative flex items-center justify-center w-full py-3 px-4 mb-4 rounded-full
      font-bold transition-all duration-200 text-sm tracking-wider
      ${bgColor} ${textColor}
      ${isOutline ? 'border border-neutral-600 hover:border-white' : ''}
    `}
    onClick={onClick || (() => console.log(`Attempting interaction with ${text}`))}
  >
    <div className="absolute left-4">
      {icon}
    </div>
    {text}
  </button>
);

export default SocialButton;