export const theme = {
  colors: {
    background: {
      primary: '#f5f5f5',
      secondary: '#ffffff'
    },
    primary: '#ffffff',
    accent: '#007bff',
    text: {
      primary: '#333333',
      secondary: '#666666'
    },
    border: '#e0e0e0',
    error: '#dc3545'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px'
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px'
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '992px',
    wide: '1200px'
  }
};

export type Theme = typeof theme; 