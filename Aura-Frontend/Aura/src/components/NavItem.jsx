import { Link } from 'react-router-dom';

const NavItem = ({ icon: Icon, name, active, small, playing, route, onClick, compact = false }) => {
    const className = `nav-item ${active ? 'active' : ''} ${small ? 'small' : ''} ${compact ? 'compact' : ''}`;

    const handleClick = (e) => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link to={route || '/'} className={className} onClick={handleClick} title={compact ? name : ''}>
            {Icon && (
                <div className="nav-icon">
                    <Icon size={compact ? 28 : (small ? 20 : 24)} />
                </div>
            )}
            {name && (
                <span className={`nav-text ${playing ? 'text-spotify-green' : ''}`}>
                    {name}
                </span>
            )}
        </Link>
    );
};

export default NavItem;