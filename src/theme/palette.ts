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
 * Dark Mode Palette
 */
export const darkPalette = {
  // Primary Colors - Dark Mode
  primary: {
    main: '#a8b2c9',        // Lighter variant for dark mode
    light: '#c7cfd9',       // Even lighter for dark mode
    lighter: '#e2e6eb',     // Very light
    lightest: '#1e1e1e',    // Dark backgrounds
    white: '#0a0a0a',       // Dark pure background
    dark: '#a87873',        // Accent for dark mode
  },

  // Background Colors - Dark Mode
  background: {
    default: '#0a0a0a',     // Main dark background
    paper: '#1a1a1a',       // Card backgrounds
    subtle: '#242424',      // Subtle sections
    hover: '#2a2a2a',       // Hover state
  },

  // Text Colors - Dark Mode with good contrast
  text: {
    primary: '#e8eaec',     // Light text for dark bg
    secondary: '#b0b0b0',   // Medium gray
    muted: '#707070',       // Muted text
    light: '#404040',       // Very muted
    accent: '#a87873',      // Accent text
  },

  // Header specific colors - Dark Mode
  header: {
    background: '#1a1a1a',  // Dark header
    text: '#e8eaec',        // Light text
    border: '#2a2a2a',      // Dark border
  },

  // Border Colors - Dark Mode
  border: {
    light: '#2a2a2a',       // Light dark border
    default: '#3a3a3a',     // Default dark border
    medium: '#4a4a4a',      // Medium dark border
  },

  // Status Colors - Dark Mode
  status: {
    success: {
      main: '#a8b2c9',
      light: '#c7cfd9',
      bg: '#242424',
    },
    error: {
      main: '#a87873',
      light: '#c79893',
      bg: '#2a1e1e',
    },
    warning: {
      main: '#c7cfd9',
      light: '#e2e6eb',
      bg: '#242424',
    },
    info: {
      main: '#a8b2c9',
      light: '#c7cfd9',
      bg: '#242424',
    },
  },

  // Gradient Combinations - Dark Mode
  gradients: {
    primary: 'linear-gradient(135deg, #a8b2c9 0%, #c7cfd9 100%)',
    subtle: 'linear-gradient(135deg, #242424 0%, #1a1a1a 100%)',
    accent: 'linear-gradient(135deg, #a87873 0%, #a8b2c9 100%)',
    card: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
    overlay: 'linear-gradient(to bottom, rgba(168, 178, 201, 0.05), rgba(0, 0, 0, 0))',
  },

  // Shadow Colors - Dark Mode
  shadows: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    strong: 'rgba(0, 0, 0, 0.7)',
    subtle: 'rgba(0, 0, 0, 0.2)',
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

/**
 * Get dark mode theme configuration
 */
export const getDarkModeConfig = () => ({
  palette: {
    mode: 'dark' as const,
    primary: {
      main: darkPalette.primary.main,
      light: darkPalette.primary.light,
      dark: darkPalette.primary.dark,
      contrastText: '#0a0a0a',
    },
    secondary: {
      main: darkPalette.primary.dark,
      light: darkPalette.primary.lighter,
      dark: darkPalette.primary.main,
      contrastText: '#0a0a0a',
    },
    background: {
      default: darkPalette.background.default,
      paper: darkPalette.background.paper,
    },
    text: {
      primary: darkPalette.text.primary,
      secondary: darkPalette.text.secondary,
      disabled: darkPalette.text.muted,
    },
    divider: darkPalette.border.light,
    error: {
      main: darkPalette.status.error.main,
      light: darkPalette.status.error.light,
      dark: '#8b5a56',
      contrastText: '#e8eaec',
    },
    success: {
      main: darkPalette.primary.main,
      light: darkPalette.primary.light,
      dark: '#8892a9',
      contrastText: '#0a0a0a',
    },
    warning: {
      main: darkPalette.primary.light,
      light: darkPalette.primary.lighter,
      dark: darkPalette.primary.main,
      contrastText: '#0a0a0a',
    },
    info: {
      main: darkPalette.primary.main,
      light: darkPalette.primary.light,
      dark: darkPalette.primary.dark,
      contrastText: '#0a0a0a',
    },
  },
});

export default palette;

