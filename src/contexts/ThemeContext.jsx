import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const ThemeContext = createContext();

// Theme options including high-level palettes
const THEME_MODES = {
  EXECUTIVE_OXFORD: "executive-oxford",
  MODERN_NEON: "modern-neon",
  CLEAN_SLATE: "clean-slate",
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
};

// Map mode to actual theme ID
const getMappedTheme = (mode) => {
  if (mode === THEME_MODES.SYSTEM) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "executive-oxford"
      : "clean-slate";
  }
  return mode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // themeMode stores user preference
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || THEME_MODES.EXECUTIVE_OXFORD;
  });

  // theme stores the actual applied theme ID
  const [theme, setTheme] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      return getMappedTheme(savedMode);
    }
    return THEME_MODES.EXECUTIVE_OXFORD;
  });

  // Apply theme to DOM with enhanced dark mode support
  const applyTheme = useCallback((actualTheme) => {
    document.body.setAttribute("data-theme", actualTheme);
    document.documentElement.setAttribute("data-theme", actualTheme);

    const root = document.documentElement;
    const isDarkTheme = [
      "dark",
      "night",
      "black",
      "dracula",
      "synthwave",
      "halloween",
      "forest",
      "luxury",
      "coffee",
      "executive-oxford",
      "modern-neon",
      "clean-slate",
    ].includes(actualTheme);

    if (isDarkTheme) {
      // Enhanced dark mode with frontend-ui-dark-ts tokens
      root.style.setProperty("--page-bg", "hsl(240, 6%, 10%)");
      root.style.setProperty("--page-bg-secondary", "hsl(240, 5%, 12%)");
      root.style.setProperty("--page-bg-elevated", "hsl(240, 4%, 18%)");

      // Text colors for dark mode
      root.style.setProperty("--color-text-primary", "#f8fafc");
      root.style.setProperty("--color-text-secondary", "#94a3b8");
      root.style.setProperty("--color-text-muted", "#64748b");

      // Glass effects (matching frontend-ui-dark-ts)
      root.style.setProperty("--glass-bg", "rgba(15, 15, 18, 0.4)");
      root.style.setProperty("--glass-border", "hsla(0, 0%, 100%, 0.12)");

      // Neumorphic shadows for dark mode
      root.style.setProperty("--neu-light", "rgba(255, 255, 255, 0.03)");
      root.style.setProperty("--neu-dark", "rgba(0, 0, 0, 0.6)");

      // Card backgrounds with depth
      root.style.setProperty("--card-bg", "hsla(240, 5%, 14%, 0.6)");
      root.style.setProperty("--card-hover", "hsla(240, 4%, 22%, 0.7)");

      // Border colors
      root.style.setProperty("--border-subtle", "hsla(0, 0%, 100%, 0.08)");
      root.style.setProperty("--border-default", "hsla(0, 0%, 100%, 0.12)");
      root.style.setProperty("--border-strong", "hsla(0, 0%, 100%, 0.20)");

      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      // Light mode defaults (kept as original but refined)
      root.style.setProperty("--page-bg", "#f8fafc");
      root.style.setProperty("--page-bg-secondary", "#ffffff");
      root.style.setProperty("--page-bg-elevated", "#ffffff");

      // Text colors for light mode (increased contrast)
      root.style.setProperty("--color-text-primary", "#0f172a");
      root.style.setProperty("--color-text-secondary", "#334155");
      root.style.setProperty("--color-text-muted", "#475569");

      // Glass effects for light mode
      root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.7)");
      root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.3)");

      // Neumorphic shadows for light mode
      root.style.setProperty("--neu-light", "rgba(255, 255, 255, 0.9)");
      root.style.setProperty("--neu-dark", "rgba(0, 0, 0, 0.1)");

      // Card backgrounds
      root.style.setProperty("--card-bg", "rgba(255, 255, 255, 0.9)");
      root.style.setProperty("--card-hover", "rgba(255, 255, 255, 1)");

      // Border colors
      root.style.setProperty("--border-subtle", "rgba(0, 0, 0, 0.04)");
      root.style.setProperty("--border-default", "rgba(0, 0, 0, 0.08)");
      root.style.setProperty("--border-strong", "rgba(0, 0, 0, 0.12)");

      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, []);

  // Change theme mode (light, dark, or system)
  const changeThemeMode = useCallback((newMode) => {
    setThemeMode(newMode);
    localStorage.setItem("themeMode", newMode);

    const actualTheme = getMappedTheme(newMode);
    setTheme(actualTheme);
    localStorage.setItem("theme", actualTheme);
  }, []);

  // Legacy changeTheme for backward compatibility
  const changeTheme = useCallback(
    (newTheme) => {
      // If it's a standard mode, use changeThemeMode
      if (Object.values(THEME_MODES).includes(newTheme)) {
        changeThemeMode(newTheme);
      } else {
        // It's a specific DaisyUI theme, apply it directly
        setTheme(newTheme);
        setThemeMode(newTheme); // Store the specific theme as the mode
        localStorage.setItem("theme", newTheme);
        localStorage.setItem("themeMode", newTheme);
      }
    },
    [changeThemeMode],
  );

  // Toggle between light and dark
  const toggleDarkMode = useCallback(() => {
    const isCurrentlyDark = [
      "dark",
      "night",
      "black",
      "dracula",
      "synthwave",
      "halloween",
      "forest",
      "luxury",
      "coffee",
      "executive-oxford",
      "modern-neon",
      "clean-slate",
    ].includes(theme);

    if (isCurrentlyDark) {
      changeThemeMode(THEME_MODES.LIGHT);
    } else {
      changeThemeMode(THEME_MODES.DARK);
    }
  }, [theme, changeThemeMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (themeMode === THEME_MODES.SYSTEM) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  // Apply theme when theme state changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const isDarkMode = [
    "dark",
    "night",
    "black",
    "dracula",
    "synthwave",
    "halloween",
    "forest",
    "luxury",
    "coffee",
    "executive-oxford",
    "modern-neon",
    "clean-slate",
  ].includes(theme);

  const value = {
    theme,
    themeMode,
    isDarkMode,
    THEME_MODES,
    changeTheme,
    changeThemeMode,
    toggleDarkMode,
    availableThemes: [
      {
        id: "executive-oxford",
        name: "Executive Oxford",
        description: "Professional & Grounded",
      },
      {
        id: "modern-neon",
        name: "Modern Neon",
        description: "Vivid & Energetic",
      },
      {
        id: "clean-slate",
        name: "Clean Slate",
        description: "Neutral & Minimalist",
      },
    ],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
