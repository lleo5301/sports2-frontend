import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
    // Default to dark
    return true;
  });

  const applyTheme = useCallback((dark) => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');

      // Dark mode CSS custom properties
      root.style.setProperty('--page-bg', 'hsl(240, 6%, 10%)');
      root.style.setProperty('--page-bg-secondary', 'hsl(240, 5%, 12%)');
      root.style.setProperty('--page-bg-elevated', 'hsl(240, 4%, 18%)');

      root.style.setProperty('--color-text-primary', '#f8fafc');
      root.style.setProperty('--color-text-secondary', '#94a3b8');
      root.style.setProperty('--color-text-muted', '#64748b');

      root.style.setProperty('--glass-bg', 'rgba(15, 15, 18, 0.4)');
      root.style.setProperty('--glass-border', 'hsla(0, 0%, 100%, 0.12)');

      root.style.setProperty('--neu-light', 'rgba(255, 255, 255, 0.03)');
      root.style.setProperty('--neu-dark', 'rgba(0, 0, 0, 0.6)');

      root.style.setProperty('--card-bg', 'hsla(240, 5%, 14%, 0.6)');
      root.style.setProperty('--card-hover', 'hsla(240, 4%, 22%, 0.7)');

      root.style.setProperty('--border-subtle', 'hsla(0, 0%, 100%, 0.08)');
      root.style.setProperty('--border-default', 'hsla(0, 0%, 100%, 0.12)');
      root.style.setProperty('--border-strong', 'hsla(0, 0%, 100%, 0.20)');

      root.style.setProperty('--color-bg-1', 'hsl(240, 6%, 10%)');
      root.style.setProperty('--color-bg-2', 'hsl(240, 5%, 12%)');
      root.style.setProperty('--color-bg-3', 'hsl(240, 5%, 14%)');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');

      // Light mode CSS custom properties
      root.style.setProperty('--page-bg', '#f8fafc');
      root.style.setProperty('--page-bg-secondary', '#ffffff');
      root.style.setProperty('--page-bg-elevated', '#ffffff');

      root.style.setProperty('--color-text-primary', '#0f172a');
      root.style.setProperty('--color-text-secondary', '#334155');
      root.style.setProperty('--color-text-muted', '#475569');

      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.3)');

      root.style.setProperty('--neu-light', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--neu-dark', 'rgba(0, 0, 0, 0.1)');

      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--card-hover', 'rgba(255, 255, 255, 1)');

      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.04)');
      root.style.setProperty('--border-default', 'rgba(0, 0, 0, 0.08)');
      root.style.setProperty('--border-strong', 'rgba(0, 0, 0, 0.12)');

      root.style.setProperty('--color-bg-1', '#f8fafc');
      root.style.setProperty('--color-bg-2', '#ffffff');
      root.style.setProperty('--color-bg-3', '#ffffff');
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // Apply theme when isDarkMode changes
  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode, applyTheme]);

  const value = {
    isDarkMode,
    toggleDarkMode,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
