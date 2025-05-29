import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useAuth } from '../../context/AuthContext';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const MainContent = styled.main`
  max-width: 935px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: 60px; // Space for mobile navigation
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-top: 84px; // Space for desktop navbar
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <LayoutContainer>
      <Navbar />
      <MainContent>
        {children}
      </MainContent>
      <MobileNav />
    </LayoutContainer>
  );
};

export default Layout; 