import { Bell, ChevronLeft, ChevronRight, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ onSearch, searchQuery = '' }) => {
  const navigate = useNavigate();

  const profileImage = 'https://placehold.co/40x40/004d40/ffffff?text=U';
  const profileAlt = 'User Profile';

  const handleSearchChange = (e) => {
    const query = e.target.value;
    // Update parent state immediately
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Search is already updated via handleSearchChange
      // Just prevent form submission
      e.preventDefault();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const NavButton = ({ Icon, onClick }) => (
    <button
      className="nav-button"
      onClick={onClick}
      aria-label={Icon === ChevronLeft ? 'Go back' : 'Go forward'}
    >
      <Icon size={20} strokeWidth={2.5} />
    </button>
  );

  const UtilityIcon = ({ Icon }) => (
    <button className="utility-icon-button">
      <Icon size={24} />
    </button>
  );

  return (
    <header className="header-bar">
      <div className="header-left-section">
        <div className="nav-arrows-container">
          <NavButton Icon={ChevronLeft} onClick={handleBack} />
          <NavButton Icon={ChevronRight} onClick={handleForward} />
        </div>

        <div className="search-bar">
          <Search size={20} className="lucide-search" />
          <input
            type="text"
            placeholder="Artists, songs, or podcasts"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="header-right-section">
        <UtilityIcon Icon={Bell} />
        <button className="profile-avatar-wrapper" onClick={() => navigate('/profile')}>
          <img src={profileImage} alt={profileAlt} className="profile-avatar-img" />
        </button>
      </div>
    </header>
  );
};

export default Header;

