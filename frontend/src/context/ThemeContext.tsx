import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeColor = 'blue' | 'green' | 'red' | 'violet' | 'yellow' | 'orange' | 'pink' | 'cyan' | 'indigo' | 'teal';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleThemeWithConfirmation: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themeColors = {
  blue: {
    light: {
      primary: '#1976d2',
      secondary: '#2196f3',
      accent: '#64b5f6',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#1976d2',
      secondary: '#2196f3',
      accent: '#64b5f6',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  green: {
    light: {
      primary: '#2e7d32',
      secondary: '#4caf50',
      accent: '#81c784',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#2e7d32',
      secondary: '#4caf50',
      accent: '#81c784',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  red: {
    light: {
      primary: '#d32f2f',
      secondary: '#f44336',
      accent: '#e57373',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#d32f2f',
      secondary: '#f44336',
      accent: '#e57373',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  violet: {
    light: {
      primary: '#7b1fa2',
      secondary: '#9c27b0',
      accent: '#ba68c8',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#7b1fa2',
      secondary: '#9c27b0',
      accent: '#ba68c8',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  yellow: {
    light: {
      primary: '#f9a825',
      secondary: '#fbc02d',
      accent: '#fdd835',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#f9a825',
      secondary: '#fbc02d',
      accent: '#fdd835',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  orange: {
    light: {
      primary: '#f57c00',
      secondary: '#ff9800',
      accent: '#ffb74d',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#f57c00',
      secondary: '#ff9800',
      accent: '#ffb74d',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  pink: {
    light: {
      primary: '#c2185b',
      secondary: '#e91e63',
      accent: '#f06292',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#c2185b',
      secondary: '#e91e63',
      accent: '#f06292',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  cyan: {
    light: {
      primary: '#0097a7',
      secondary: '#00bcd4',
      accent: '#4dd0e1',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#0097a7',
      secondary: '#00bcd4',
      accent: '#4dd0e1',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  indigo: {
    light: {
      primary: '#303f9f',
      secondary: '#3f51b5',
      accent: '#7986cb',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#303f9f',
      secondary: '#3f51b5',
      accent: '#7986cb',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  },
  teal: {
    light: {
      primary: '#00796b',
      secondary: '#009688',
      accent: '#4db6ac',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0'
    },
    dark: {
      primary: '#00796b',
      secondary: '#009688',
      accent: '#4db6ac',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333'
    }
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  const [color, setColor] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('themeColor');
    return (savedColor as ThemeColor) || 'blue';
  });

  const toggleThemeWithConfirmation = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    if (window.confirm(`¿Deseas cambiar al modo ${newMode === 'light' ? 'claro' : 'oscuro'}?`)) {
      setMode(newMode);
    }
  };

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('themeColor', color);
    
    const theme = themeColors[color][mode];
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });

    // Aplicar el tema al body también
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [mode, color]);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor, toggleThemeWithConfirmation }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const getCurrentTheme = (mode: ThemeMode, color: ThemeColor) => {
  return themeColors[color][mode];
};

export default ThemeContext; 