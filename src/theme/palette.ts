/**
 * Expensia - Professional Color Palette
 * Smooth, light, and modern design system
 */

export const palette = {
  // Primary Colors - Light and Professional
  primary: {
    main: '#8892a9',        // Sephiroth Grey - Main brand color
    light: '#b7bac3',       // Silver Springs - Light variant
    lighter: '#d2d6db',     // Angel Hair Silver - Very light
    lightest: '#e8eaec',    // Mourn Mountain Snow - Subtle backgrounds
    white: '#fdfdfd',       // Brilliance - Pure white
    dark: '#845c58',        // Book Binder - Accent/dark elements
  },

  // Background Colors
  background: {
    default: '#fdfdfd',     // Brilliance - Main background
    paper: '#ffffff',       // Pure white for cards
    subtle: '#e8eaec',      // Mourn Mountain Snow - Subtle sections
    hover: '#f5f6f7',       // Light hover state
  },

  // Text Colors - Enhanced for better contrast
  text: {
    primary: '#1a202c',     // Darker for better contrast (WCAG AA)
    secondary: '#6b7280',   // Medium gray with good contrast
    muted: '#9ca3af',       // Light gray for less important text
    light: '#d1d5db',       // Very light for disabled states
    accent: '#845c58',      // Book Binder - Accent text
  },

  // Header specific colors
  header: {
    background: '#ffffff',  // Solid white background
    text: '#1a202c',        // Dark text for contrast
    border: '#e5e7eb',      // Light border
  },

  // Border Colors
  border: {
    light: '#e8eaec',       // Mourn Mountain Snow
    default: '#d2d6db',     // Angel Hair Silver
    medium: '#b7bac3',      // Silver Springs
  },

  // Status Colors - Adapted to palette
  status: {
    success: {
      main: '#8892a9',
      light: '#b7bac3',
      bg: '#e8eaec',
    },
    error: {
      main: '#845c58',
      light: '#a87873',
      bg: '#f5eeed',
    },
    warning: {
      main: '#b7bac3',
      light: '#d2d6db',
      bg: '#e8eaec',
    },
    info: {
      main: '#8892a9',
      light: '#b7bac3',
      bg: '#e8eaec',
    },
  },

  // Gradient Combinations
  gradients: {
    primary: 'linear-gradient(135deg, #8892a9 0%, #b7bac3 100%)',
    subtle: 'linear-gradient(135deg, #e8eaec 0%, #fdfdfd 100%)',
    accent: 'linear-gradient(135deg, #845c58 0%, #8892a9 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #fdfdfd 100%)',
    overlay: 'linear-gradient(to bottom, rgba(136, 146, 169, 0.05), rgba(255, 255, 255, 0))',
  },

  // Shadow Colors
  shadows: {
    light: 'rgba(136, 146, 169, 0.08)',
    medium: 'rgba(136, 146, 169, 0.12)',
    strong: 'rgba(136, 146, 169, 0.16)',
    subtle: 'rgba(232, 234, 236, 0.5)',
  },
};

/**
 * Material-UI Theme Configuration
 */
export const themeConfig = {
  palette: {
    mode: 'light' as const,
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
      dark: palette.primary.dark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: palette.primary.dark,
      light: palette.primary.lighter,
      dark: palette.primary.main,
      contrastText: '#ffffff',
    },
    background: {
      default: palette.background.default,
      paper: palette.background.paper,
    },
    text: {
      primary: palette.text.primary,
      secondary: palette.text.secondary,
      disabled: palette.text.muted,
    },
    divider: palette.border.light,
    error: {
      main: palette.status.error.main,
      light: palette.status.error.light,
      dark: '#6b4a47',
      contrastText: '#ffffff',
    },
    success: {
      main: palette.primary.main,
      light: palette.primary.light,
      dark: '#6b7589',
      contrastText: '#ffffff',
    },
    warning: {
      main: palette.primary.light,
      light: palette.primary.lighter,
      dark: palette.primary.main,
      contrastText: '#2c3e50',
    },
    info: {
      main: palette.primary.main,
      light: palette.primary.light,
      dark: palette.primary.dark,
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      color: palette.text.primary,
    },
    h2: {
      fontWeight: 700,
      color: palette.text.primary,
    },
    h3: {
      fontWeight: 700,
      color: palette.text.primary,
    },
    h4: {
      fontWeight: 600,
      color: palette.text.primary,
    },
    h5: {
      fontWeight: 600,
      color: palette.text.primary,
    },
    h6: {
      fontWeight: 600,
      color: palette.text.primary,
    },
    body1: {
      color: palette.text.primary,
    },
    body2: {
      color: palette.text.secondary,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${palette.shadows.medium}`,
          },
        },
        contained: {
          background: palette.gradients.primary,
          boxShadow: `0 2px 8px ${palette.shadows.medium}`,
          '&:hover': {
            boxShadow: `0 4px 16px ${palette.shadows.strong}`,
          },
        },
        small: {
          padding: '6px 16px',
          fontSize: '0.875em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: `0 4px 12px ${palette.shadows.light}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${palette.shadows.medium}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: `0 2px 8px ${palette.shadows.light}`,
        },
        elevation2: {
          boxShadow: `0 4px 12px ${palette.shadows.light}`,
        },
        elevation3: {
          boxShadow: `0 6px 16px ${palette.shadows.medium}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 2px 8px ${palette.shadows.light}`,
            },
            '&.Mui-focused': {
              boxShadow: `0 4px 12px ${palette.shadows.medium}`,
            },
          },
        },
      },
    },
  },
};

export default palette;
