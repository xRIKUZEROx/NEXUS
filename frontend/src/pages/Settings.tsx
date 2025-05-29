import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPalette,
  faUser,
  faShield,
  faBell,
  faLanguage,
  faUniversalAccess,
  faKey,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import ThemeSelector from '../components/ThemeSelector';

// Types
interface SettingsState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  messageNotifications: boolean;
  profilePrivate: boolean;
  showActivity: boolean;
  twoFactorAuth: boolean;
  language: string;
  region: string;
  fontSize: string;
  reduceMotion: boolean;
  highContrast: boolean;
  [key: string]: boolean | string; // Index signature
}

interface ToggleSwitchProps {
  checked: boolean;
  onClick: () => void;
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const Sidebar = styled(motion.div)`
  background-color: var(--surface);
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MenuTitle = styled.h2`
  color: var(--text);
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const MenuItem = styled(motion.div)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text)'};
  background-color: ${props => props.active ? 'var(--surface-hover)' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background-color: var(--surface-hover);
    color: var(--primary);
    transform: translateX(4px);
  }

  .menu-icon {
    font-size: 1.2rem;
  }
`;

const Content = styled(motion.div)`
  background-color: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ContentTitle = styled.h1`
  color: var(--text);
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const OptionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const OptionTitle = styled.h3`
  color: var(--text);
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: var(--background);
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--surface-hover);
  }
`;

const ToggleSwitch = styled.div<ToggleSwitchProps>`
  width: 48px;
  height: 24px;
  background-color: ${props => props.checked ? 'var(--primary)' : 'var(--border)'};
  border-radius: 12px;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    transition: transform 0.2s;
    transform: translateX(${props => props.checked ? '24px' : '0'});
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    profilePrivate: false,
    showActivity: true,
    twoFactorAuth: false,
    language: 'es',
    region: 'ES',
    fontSize: 'medium',
    reduceMotion: false,
    highContrast: false
  });

  const menuItems = [
    { id: 'appearance', icon: faPalette, label: 'Apariencia' },
    { id: 'privacy', icon: faShield, label: 'Privacidad' },
    { id: 'notifications', icon: faBell, label: 'Notificaciones' },
    { id: 'security', icon: faKey, label: 'Seguridad' },
    { id: 'language', icon: faLanguage, label: 'Idioma y región' },
    { id: 'accessibility', icon: faUniversalAccess, label: 'Accesibilidad' }
  ];

  const handleToggle = (setting: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <>
            <ContentTitle>Personalización</ContentTitle>
            <ThemeSelector />
          </>
        );

      case 'privacy':
        return (
          <>
            <ContentTitle>Privacidad</ContentTitle>
            <Section>
              <OptionGroup>
                <Toggle>
                  <span>Perfil privado</span>
                  <ToggleSwitch
                    checked={settings.profilePrivate}
                    onClick={() => handleToggle('profilePrivate')}
                  />
                </Toggle>
                <Toggle>
                  <span>Mostrar actividad</span>
                  <ToggleSwitch
                    checked={settings.showActivity}
                    onClick={() => handleToggle('showActivity')}
                  />
                </Toggle>
              </OptionGroup>
            </Section>
          </>
        );

      case 'notifications':
        return (
          <>
            <ContentTitle>Notificaciones</ContentTitle>
            <Section>
              <OptionGroup>
                <Toggle>
                  <span>Notificaciones por email</span>
                  <ToggleSwitch
                    checked={settings.emailNotifications}
                    onClick={() => handleToggle('emailNotifications')}
                  />
                </Toggle>
                <Toggle>
                  <span>Notificaciones push</span>
                  <ToggleSwitch
                    checked={settings.pushNotifications}
                    onClick={() => handleToggle('pushNotifications')}
                  />
                </Toggle>
                <Toggle>
                  <span>Notificaciones de mensajes</span>
                  <ToggleSwitch
                    checked={settings.messageNotifications}
                    onClick={() => handleToggle('messageNotifications')}
                  />
                </Toggle>
              </OptionGroup>
            </Section>
          </>
        );

      case 'security':
        return (
          <>
            <ContentTitle>Seguridad</ContentTitle>
            <Section>
              <OptionGroup>
                <Toggle>
                  <span>Autenticación de dos factores</span>
                  <ToggleSwitch
                    checked={settings.twoFactorAuth}
                    onClick={() => handleToggle('twoFactorAuth')}
                  />
                </Toggle>
              </OptionGroup>
            </Section>
          </>
        );

      case 'language':
        return (
          <>
            <ContentTitle>Idioma y región</ContentTitle>
            <Section>
              <OptionGroup>
                <OptionTitle>Idioma</OptionTitle>
                <Select
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </Select>
              </OptionGroup>
              <OptionGroup>
                <OptionTitle>Región</OptionTitle>
                <Select
                  value={settings.region}
                  onChange={(e) => setSettings(prev => ({ ...prev, region: e.target.value }))}
                >
                  <option value="ES">España</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                </Select>
              </OptionGroup>
            </Section>
          </>
        );

      case 'accessibility':
        return (
          <>
            <ContentTitle>Accesibilidad</ContentTitle>
            <Section>
              <OptionGroup>
                <Toggle>
                  <span>Reducir movimiento</span>
                  <ToggleSwitch
                    checked={settings.reduceMotion}
                    onClick={() => handleToggle('reduceMotion')}
                  />
                </Toggle>
                <Toggle>
                  <span>Alto contraste</span>
                  <ToggleSwitch
                    checked={settings.highContrast}
                    onClick={() => handleToggle('highContrast')}
                  />
                </Toggle>
              </OptionGroup>
              <OptionGroup>
                <OptionTitle>Tamaño de fuente</OptionTitle>
                <Select
                  value={settings.fontSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value }))}
                >
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                  <option value="xlarge">Extra grande</option>
                </Select>
              </OptionGroup>
            </Section>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Sidebar
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <MenuTitle>Configuración</MenuTitle>
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            active={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={item.icon} className="menu-icon" />
            {item.label}
          </MenuItem>
        ))}
      </Sidebar>
      <Content
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </Content>
    </Container>
  );
};

export default Settings; 