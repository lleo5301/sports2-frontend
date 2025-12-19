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

  // Apply theme to DOM
  const applyTheme = useCallback((actualTheme) => {
    document.body.setAttribute('data-theme', actualTheme);
    document.documentElement.setAttribute('data-theme', actualTheme);

    // Update page background for dark themes
    const root = document.documentElement;
    const isDarkTheme = ['dark', 'night', 'black', 'dracula', 'synthwave', 'halloween', 'forest', 'luxury', 'coffee'].includes(actualTheme);
    if (isDarkTheme) {
      root.style.removeProperty('--page-bg');
    } else {
      root.style.setProperty('--page-bg', '#f8fafc');
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