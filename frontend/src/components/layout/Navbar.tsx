import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAtom,
  faHome,
  faPlug,
  faCompass,
  faBell,
  faPlusCircle,
  faUserAstronaut,
  faSearch,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import NotificationsDropdown from '../NotificationsDropdown';

// Interfaces
interface SearchUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

const NavbarContainer = styled.nav`
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavContent = styled.div`
  max-width: 975px;
  margin: 0 auto;
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text);
  text-decoration: none;

  .logo-icon {
    color: var(--primary);
  }

  &:hover .logo-icon {
    transform: rotate(180deg);
    transition: transform 0.6s ease;
  }
`;

const SearchContainer = styled(motion.div)`
  position: relative;
  width: 268px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 8px 36px;
  background-color: var(--background);
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--text);
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-transparent);
  }
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  transition: color 0.3s ease;

  ${SearchInput}:focus + & {
    color: var(--primary);
  }
`;

const SearchResults = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const SearchResultItem = styled(motion.div)`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--surface-hover);
    transform: translateX(4px);
  }
`;

const UserAvatar = styled(motion.img)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;

  ${SearchResultItem}:hover & {
    border-color: var(--primary);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.div`
  color: var(--text);
  font-weight: 500;
`;

const FullName = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavIconContainer = styled(motion.div)<{ isActive?: boolean }>`
  position: relative;
  cursor: pointer;

  .nav-icon {
    font-size: 1.5rem;
    color: ${props => props.isActive ? 'var(--primary)' : 'var(--text)'};
    transition: all 0.3s ease;
  }

  &:hover .nav-icon {
    color: var(--primary);
    transform: scale(1.1);
  }

  .icon-tooltip {
    position: absolute;
    bottom: -32px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background-color: var(--surface);
    color: var(--text);
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border);
  }

  &:hover .icon-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 768px) {
    &.desktop-only {
      display: none;
    }
  }
`;

const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--primary);
  color: white;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        // Aquí deberías hacer la llamada a tu API real
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data);
        setIsSearching(true);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo
          to="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faAtom} className="logo-icon" />
          <span>Nexus</span>
        </Logo>

        <SearchContainer
          initial={false}
          animate={{ width: isSearching ? 300 : 268 }}
          transition={{ duration: 0.2 }}
        >
          <SearchIcon icon={faSearch} />
          <SearchInput
            type="text"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />
          <AnimatePresence>
            {isSearching && (
              <SearchResults
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {searchResults.map((user: SearchUser) => (
                  <SearchResultItem
                    key={user.id}
                    onClick={() => {
                      navigate(`/profile/${user.username}`);
                      setIsSearching(false);
                      setSearchQuery('');
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserAvatar 
                      src={user.avatar} 
                      alt={user.username}
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <Username>{user.username}</Username>
                      <FullName>{user.fullName}</FullName>
                    </div>
                  </SearchResultItem>
                ))}
              </SearchResults>
            )}
          </AnimatePresence>
        </SearchContainer>

        <NavIcons>
          {[
            { icon: faHome, tooltip: 'Inicio', path: '/' },
            { icon: faPlug, tooltip: 'Conexiones', path: '/messages' },
            { icon: faCompass, tooltip: 'Descubrir', path: '/explore', className: 'desktop-only' },
            { icon: faPlusCircle, tooltip: 'Crear', path: '/create', className: 'desktop-only' },
            { icon: faUserAstronaut, tooltip: 'Mi Perfil', path: `/profile/${user?.username}` },
            { icon: faCog, tooltip: 'Configuración', path: '/settings' }
          ].map((item, index) => (
            <NavIconContainer
              key={item.path}
              className={item.className}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={item.icon} className="nav-icon" />
              <div className="icon-tooltip">{item.tooltip}</div>
            </NavIconContainer>
          ))}

          <NavIconContainer 
            ref={notificationsRef}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faBell} className="nav-icon" />
            <NotificationBadge
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              2
            </NotificationBadge>
            <div className="icon-tooltip">Notificaciones</div>
            <NotificationsDropdown 
              isOpen={isNotificationsOpen} 
              onClose={() => setIsNotificationsOpen(false)}
            />
          </NavIconContainer>
        </NavIcons>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar; 