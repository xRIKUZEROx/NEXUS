import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faPlusCircle,
  faBell,
  faUserAstronaut
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const MobileNavContainer = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 1000;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavIcons = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const NavIconContainer = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};

  .mobile-nav-icon {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

const MobileNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <MobileNavContainer>
      <NavIcons>
        <NavIconContainer onClick={() => navigate('/')}>
          <FontAwesomeIcon icon={faHome} className="mobile-nav-icon" />
        </NavIconContainer>

        <NavIconContainer onClick={() => navigate('/explore')}>
          <FontAwesomeIcon icon={faSearch} className="mobile-nav-icon" />
        </NavIconContainer>

        <NavIconContainer>
          <FontAwesomeIcon icon={faPlusCircle} className="mobile-nav-icon" />
        </NavIconContainer>

        <NavIconContainer>
          <FontAwesomeIcon icon={faBell} className="mobile-nav-icon" />
        </NavIconContainer>

        <NavIconContainer onClick={() => navigate(`/profile/${user?.username}`)}>
          <FontAwesomeIcon icon={faUserAstronaut} className="mobile-nav-icon" />
        </NavIconContainer>
      </NavIcons>
    </MobileNavContainer>
  );
};

export default MobileNav; 