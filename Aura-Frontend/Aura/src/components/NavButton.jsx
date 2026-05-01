
/**
 * Reusable navigation button component (Back / Forward)
 */
const NavButton = ({ Icon, isDisabled, onClick, label }) => {
  return (
    <button
      tabIndex="0"
      onClick={onClick}
      aria-label={label}
      disabled={isDisabled}
      className={`
        p-2 rounded-full transition-all duration-150 
        focus:ring-2 focus:ring-green-400 focus:outline-none
        ${isDisabled 
          ? 'text-gray-600 bg-black/50 cursor-not-allowed' 
          : 'text-white bg-black/70 hover:bg-black/90'}
      `}
    >
      <Icon size={20} strokeWidth={2.5} />
    </button>
  );
};

export default NavButton;
