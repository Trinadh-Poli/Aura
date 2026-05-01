
/**
 * Generic utility icon button (e.g., Settings, Notifications)
 */
const UtilityIcon = ({ Icon, onClick, label }) => {
  return (
    <button
      tabIndex="0"
      onClick={onClick}
      aria-label={label}
      className="
        p-2 rounded-full text-white/80 transition-all duration-150
        hover:text-white hover:bg-black/30 
        focus:ring-2 focus:ring-green-400 focus:outline-none
      "
    >
      <Icon size={24} />
    </button>
  );
};

export default UtilityIcon;
