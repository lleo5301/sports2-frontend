import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// Theme mode options: 'light', 'dark', 'system'
const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Map mode to actual DaisyUI theme
const getMappedTheme = (mode) => {
  if (mode === THEME_MODES.SYSTEM) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // themeMode stores user preference: 'light', 'dark', or 'system'
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || THEME_MODES.LIGHT;
  });

  // theme stores the actual applied theme (for backward compatibility)
  const [theme, setTheme] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    const savedTheme = localStorage.getItem('theme');
    if (savedMode) {
      return getMappedTheme(savedMode);
    }
    return savedTheme || 'light';
  });

  // Apply theme to DOM with enhanced dark mode support
  const applyTheme = useCallback((actualTheme) => {
    document.body.setAttribute('data-theme', actualTheme);
    document.documentElement.setAttribute('data-theme', actualTheme);

    const root = document.documentElement;
    const isDarkTheme = ['dark', 'night', 'black', 'dracula', 'synthwave', 'halloween', 'forest', 'luxury', 'coffee'].includes(actualTheme);

    if (isDarkTheme) {
      // Enhanced dark mode with better tonal variations
      root.style.setProperty('--page-bg', '#0f0f12');
      root.style.setProperty('--page-bg-secondary', '#1a1a1f');
      root.style.setProperty('--page-bg-elevated', '#24242b');

      // Glass effects for dark mode
      root.style.setProperty('--glass-bg', 'rgba(30, 30, 36, 0.8)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');

      // Neumorphic shadows for dark mode
      root.style.setProperty('--neu-light', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--neu-dark', 'rgba(0, 0, 0, 0.5)');

      // Card backgrounds with depth
      root.style.setProperty('--card-bg', 'rgba(30, 30, 36, 0.6)');
      root.style.setProperty('--card-hover', 'rgba(40, 40, 48, 0.8)');

      // Border colors
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.06)');
      root.style.setProperty('--border-default', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--border-strong', 'rgba(255, 255, 255, 0.15)');
    } else {
      // Light mode defaults
      root.style.setProperty('--page-bg', '#f8fafc');
      root.style.setProperty('--page-bg-secondary', '#ffffff');
      root.style.setProperty('--page-bg-elevated', '#ffffff');

      // Glass effects for light mode
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.3)');

      // Neumorphic shadows for light mode
      root.style.setProperty('--neu-light', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--neu-dark', 'rgba(0, 0, 0, 0.1)');

      // Card backgrounds
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--card-hover', 'rgba(255, 255, 255, 1)');

      // Border colors
      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.04)');
      root.style.setProperty('--border-default', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--border-strong', 'rgba(0, 0, 0, 0.12)');
    }
  }, []);

  // Change theme mode (light, dark, or system)
  const changeThemeMode = useCallback((newMode) => {
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);

    const actualTheme = getMappedTheme(newMode);
    setTheme(actualTheme);
    localStorage.setItem('theme', actualTheme);
    applyTheme(actualTheme);
  }, [applyTheme]);

  // Legacy changeTheme for backward compatibility
  const changeTheme = useCallback((newTheme) => {
    // If it's a standard mode, use changeThemeMode
    if (Object.values(THEME_MODES).includes(newTheme)) {
      changeThemeMode(newTheme);
    } else {
      // It's a specific DaisyUI theme, apply it directly
      setTheme(newTheme);
      setThemeMode(newTheme); // Store the specific theme as the mode
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('themeMode', newTheme);
      applyTheme(newTheme);
    }
  }, [changeThemeMode, applyTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      if (themeMode === THEME_MODES.SYSTEM) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, applyTheme]);

  // Set initial theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const value = {
    theme,
    themeMode,
    changeTheme,
    changeThemeMode,
    THEME_MODES,
    isDarkMode: ['dark', 'night', 'black', 'dracula', 'synthwave', 'halloween', 'forest', 'luxury', 'coffee'].includes(theme),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 