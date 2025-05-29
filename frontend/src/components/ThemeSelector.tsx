import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  padding: 1.5rem;
  background-color: var(--surface);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const Title = styled.h3`
  color: var(--text);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModeToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${props => props.isActive ? 'var(--primary)' : 'var(--border)'};
  background-color: ${props => props.isActive ? 'var(--primary)' : 'var(--surface)'};
  color: ${props => props.isActive ? 'white' : 'var(--text)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.isActive ? 'var(--primary)' : 'var(--surface-hover)'};
  }

  .mode-icon {
    font-size: 1.25rem;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 1rem;
`;

const ColorButton = styled.button<{ colorValue: string; isSelected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid ${props => props.isSelected ? 'var(--primary)' : 'transparent'};
  background-color: ${props => props.colorValue};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
    opacity: ${props => props.isSelected ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 1.5rem;
    opacity: ${props => props.isSelected ? 1 : 0};
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const ThemeSelector: React.FC = () => {
  const { mode, color, setMode, setColor, toggleThemeWithConfirmation } = useTheme();

  const colors = {
    blue: '#1976d2',
    green: '#2e7d32',
    red: '#d32f2f',
    violet: '#7b1fa2',
    yellow: '#f9a825',
    orange: '#f57c00',
    pink: '#c2185b',
    cyan: '#0097a7',
    indigo: '#303f9f',
    teal: '#00796b'
  };

  return (
    <Container>
      <Title>Personalización del tema</Title>
      
      <Section>
        <ModeToggle>
          <ToggleButton
            isActive={mode === 'light'}
            onClick={() => toggleThemeWithConfirmation()}
          >
            <FontAwesomeIcon icon={faSun} className="mode-icon" /> 
            Modo claro
          </ToggleButton>
          <ToggleButton
            isActive={mode === 'dark'}
            onClick={() => toggleThemeWithConfirmation()}
          >
            <FontAwesomeIcon icon={faMoon} className="mode-icon" /> 
            Modo oscuro
          </ToggleButton>
        </ModeToggle>
      </Section>

      <Section>
        <Title>Color del tema</Title>
        <ColorGrid>
          {Object.entries(colors).map(([colorName, colorValue]) => (
            <ColorButton
              key={colorName}
              colorValue={colorValue}
              isSelected={color === colorName}
              onClick={() => setColor(colorName as any)}
              aria-label={`Color tema ${colorName}`}
            />
          ))}
        </ColorGrid>
      </Section>
    </Container>
  );
};

export default ThemeSelector; 