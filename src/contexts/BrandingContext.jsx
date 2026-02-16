import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const BrandingContext = createContext();

// Convert hex color to OKLCH values (DaisyUI 4.x uses OKLCH format)
function hexToOKLCH(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex to RGB (0-1 range)
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Convert sRGB to linear RGB
  const toLinear = (c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  r = toLinear(r);
  g = toLinear(g);
  b = toLinear(b);

  // Convert linear RGB to OKLab
  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bOK = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  // Convert OKLab to OKLCH
  const C = Math.sqrt(a * a + bOK * bOK);
  let H = (Math.atan2(bOK, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  // Return as OKLCH format: "L C H" (L as decimal 0-1, not percentage)
  return `${L.toFixed(4)} ${C.toFixed(4)} ${H.toFixed(2)}`;
}

// Generate contrasting content color in OKLCH (text color for buttons, etc.)
function getContrastColor(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white or dark in OKLCH format (achromatic - no chroma)
  // White: L=1, C=0, H=0 | Dark: L=0.2, C=0, H=0
  return luminance > 0.5 ? '0.2 0 0' : '1 0 0';
}

// Get luminance value for a color (0-1 scale)
function getLuminance(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// Convert hex to RGB string for use with rgba()
function hexToRGB(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// Darken a hex color by a percentage (for readable heading text)
function darkenColor(hex, percent) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Lighten a hex color by a percentage (for subtle backgrounds)
function lightenColor(hex, percent) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Generate a complete color palette derived from primary color
function generatePalette(primaryHex) {
  primaryHex = primaryHex.replace(/^#/, '');
  const r = parseInt(primaryHex.substring(0, 2), 16);
  const g = parseInt(primaryHex.substring(2, 4), 16);
  const b = parseInt(primaryHex.substring(4, 6), 16);

  // Convert to HSL for easier manipulation
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const rNorm = r / 255,
      gNorm = g / 255,
      bNorm = b / 255;
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
      default:
        h = 0;
    }
  }

  // Helper to convert HSL back to hex
  const hslToHex = (h, s, l) => {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let rOut, gOut, bOut;
    if (s === 0) {
      rOut = gOut = bOut = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rOut = hue2rgb(p, q, h + 1 / 3);
      gOut = hue2rgb(p, q, h);
      bOut = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(rOut)}${toHex(gOut)}${toHex(bOut)}`;
  };

  // Generate palette colors - all derived from primary for cohesive team branding
  // Using monochromatic + analogous color scheme for visual harmony
  return {
    // Info: Lighter, less saturated version of primary
    info: hslToHex(h, Math.min(s * 0.7, 0.5), Math.min(l + 0.2, 0.6)),
    // Success: Slight hue shift towards cyan/teal, keeps brand feel
    success: hslToHex((h + 0.08) % 1, Math.min(s * 0.8, 0.55), 0.45),
    // Warning: Warmer shift from primary, maintains harmony
    warning: hslToHex((h + 0.95) % 1, Math.min(s * 0.85, 0.65), 0.5),
    // Error: Complementary warm tone, muted for cohesion
    error: hslToHex((h + 0.5) % 1, Math.min(s * 0.7, 0.55), 0.48),
    // Neutral: Desaturated version of primary
    neutral: hslToHex(h, s * 0.15, 0.25),
    // Additional semantic colors for dashboard cards - all primary-derived
    primaryLight: hslToHex(
      h,
      Math.min(s * 0.6, 0.45),
      Math.min(l + 0.25, 0.65)
    ),
    primaryMuted: hslToHex(h, Math.min(s * 0.5, 0.4), 0.55),
    secondary: hslToHex((h + 0.05) % 1, Math.min(s * 0.75, 0.5), 0.5)
  };
}

export function BrandingProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [branding, setBranding] = useState({
    name: '',
    programName: '',
    logoUrl: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
    loading: true
  });

  const fetchBranding = useCallback(async () => {
    if (!isAuthenticated) {
      setBranding((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      const response = await api.get('/teams/branding');
      if (response.data.success) {
        const data = response.data.data;
        setBranding({
          name: data.name || '',
          programName: data.program_name || '',
          logoUrl: data.logo_url,
          primaryColor: data.primary_color || '#3B82F6',
          secondaryColor: data.secondary_color || '#EF4444',
          loading: false
        });
      }
    } catch (error) {
      setBranding((prev) => ({ ...prev, loading: false }));
    }
  }, [isAuthenticated]);

  // Apply CSS variables for team colors
  const applyBrandingColors = useCallback(() => {
    if (!branding.primaryColor || !branding.secondaryColor) return;

    const root = document.documentElement;

    // Generate full color palette from primary color
    const palette = generatePalette(branding.primaryColor);

    // Set primary color (DaisyUI) with focus variant
    root.style.setProperty('--p', hexToOKLCH(branding.primaryColor));
    root.style.setProperty('--pc', getContrastColor(branding.primaryColor));
    root.style.setProperty(
      '--pf',
      hexToOKLCH(darkenColor(branding.primaryColor, 15))
    );

    // Set secondary color - use palette-derived if the literal is too dark for visibility
    // This ensures gradient cards remain visible while keeping brand cohesion
    const secondaryLuminance = getLuminance(branding.secondaryColor);
    const visibleSecondary =
      secondaryLuminance < 0.15 ? palette.secondary : branding.secondaryColor;
    root.style.setProperty('--s', hexToOKLCH(visibleSecondary));
    root.style.setProperty('--sc', getContrastColor(visibleSecondary));
    root.style.setProperty(
      '--sf',
      hexToOKLCH(darkenColor(visibleSecondary, 15))
    );

    // Set accent - slightly lighter variant of primary for harmony
    const accentColor =
      palette.primaryLight || lightenColor(branding.primaryColor, 20);
    root.style.setProperty('--a', hexToOKLCH(accentColor));
    root.style.setProperty('--ac', getContrastColor(accentColor));
    root.style.setProperty('--af', hexToOKLCH(darkenColor(accentColor, 15)));

    // Set neutral color - muted version of primary for consistency
    const neutralColor = palette.primaryMuted || palette.neutral;
    root.style.setProperty('--n', hexToOKLCH(neutralColor));
    root.style.setProperty('--nc', getContrastColor(neutralColor));
    root.style.setProperty('--nf', hexToOKLCH(darkenColor(neutralColor, 15)));

    // Set info color (lighter primary)
    root.style.setProperty('--in', hexToOKLCH(palette.info));
    root.style.setProperty('--inc', getContrastColor(palette.info));

    // Set success color (teal derived from primary)
    root.style.setProperty('--su', hexToOKLCH(palette.success));
    root.style.setProperty('--suc', getContrastColor(palette.success));

    // Set warning color (amber)
    root.style.setProperty('--wa', hexToOKLCH(palette.warning));
    root.style.setProperty('--wac', getContrastColor(palette.warning));

    // Set error color (muted red)
    root.style.setProperty('--er', hexToOKLCH(palette.error));
    root.style.setProperty('--erc', getContrastColor(palette.error));

    // Set custom CSS variables for direct color access (hex format)
    root.style.setProperty('--team-primary', branding.primaryColor);
    root.style.setProperty('--team-secondary', branding.secondaryColor);
    root.style.setProperty(
      '--team-primary-rgb',
      hexToRGB(branding.primaryColor)
    );
    root.style.setProperty(
      '--team-secondary-rgb',
      hexToRGB(branding.secondaryColor)
    );

    // Support for .bg-adaptive and .text-contrast utilities
    root.style.setProperty('--bg-color', branding.primaryColor);
    root.style.setProperty(
      '--text-on-bg',
      getLuminance(branding.primaryColor) > 0.5 ? '#000000' : '#FFFFFF'
    );

    // Set heading/text colors based on primary (slightly darker for better readability)
    root.style.setProperty(
      '--team-heading',
      darkenColor(branding.primaryColor, 15)
    );
    root.style.setProperty('--team-heading-light', branding.primaryColor);
    root.style.setProperty(
      '--team-accent-bg',
      lightenColor(branding.primaryColor, 90)
    );
    root.style.setProperty(
      '--team-accent-border',
      lightenColor(branding.primaryColor, 70)
    );

    // Glass effect colors based on team colors (for glassmorphism)
    root.style.setProperty(
      '--team-glass-bg',
      `rgba(${hexToRGB(branding.primaryColor)}, 0.1)`
    );
    root.style.setProperty(
      '--team-glass-border',
      `rgba(${hexToRGB(branding.primaryColor)}, 0.2)`
    );

    // Gradient stops for modern gradients
    root.style.setProperty('--team-gradient-start', branding.primaryColor);
    root.style.setProperty(
      '--team-gradient-end',
      lightenColor(branding.primaryColor, 30)
    );

    // Glow colors for hover effects
    root.style.setProperty(
      '--team-glow',
      `rgba(${hexToRGB(branding.primaryColor)}, 0.4)`
    );
    root.style.setProperty(
      '--team-glow-subtle',
      `rgba(${hexToRGB(branding.primaryColor)}, 0.15)`
    );

    // Focus ring color
    root.style.setProperty(
      '--team-focus-ring',
      `rgba(${hexToRGB(branding.primaryColor)}, 0.3)`
    );

    // Set page background color (subtle gray for light mode, handled by theme for dark)
    const currentTheme = root.getAttribute('data-theme');
    const isDarkTheme =
      currentTheme &&
      [
        'dark',
        'night',
        'black',
        'dracula',
        'synthwave',
        'halloween',
        'forest',
        'luxury',
        'coffee'
      ].includes(currentTheme);
    if (!isDarkTheme) {
      root.style.setProperty('--page-bg', '#f8fafc');
    } else {
      root.style.removeProperty('--page-bg');
    }
  }, [branding.primaryColor, branding.secondaryColor]);

  // Clear branding colors (reset to theme defaults)
  const clearBrandingColors = useCallback(() => {
    const root = document.documentElement;
    root.style.removeProperty('--p');
    root.style.removeProperty('--pc');
    root.style.removeProperty('--pf');
    root.style.removeProperty('--s');
    root.style.removeProperty('--sc');
    root.style.removeProperty('--sf');
    root.style.removeProperty('--a');
    root.style.removeProperty('--ac');
    root.style.removeProperty('--af');
    root.style.removeProperty('--n');
    root.style.removeProperty('--nc');
    root.style.removeProperty('--nf');
    root.style.removeProperty('--in');
    root.style.removeProperty('--inc');
    root.style.removeProperty('--su');
    root.style.removeProperty('--suc');
    root.style.removeProperty('--wa');
    root.style.removeProperty('--wac');
    root.style.removeProperty('--er');
    root.style.removeProperty('--erc');
    root.style.removeProperty('--team-primary');
    root.style.removeProperty('--team-secondary');
    root.style.removeProperty('--team-primary-rgb');
    root.style.removeProperty('--team-secondary-rgb');
    root.style.removeProperty('--team-heading');
    root.style.removeProperty('--team-heading-light');
    root.style.removeProperty('--team-accent-bg');
    root.style.removeProperty('--team-accent-border');
    root.style.removeProperty('--team-glass-bg');
    root.style.removeProperty('--team-glass-border');
    root.style.removeProperty('--team-gradient-start');
    root.style.removeProperty('--team-gradient-end');
    root.style.removeProperty('--team-glow');
    root.style.removeProperty('--team-glow-subtle');
    root.style.removeProperty('--team-focus-ring');
  }, []);

  // Fetch branding when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.team_id) {
      fetchBranding();
    } else {
      clearBrandingColors();
      setBranding({
        name: '',
        programName: '',
        logoUrl: null,
        primaryColor: '#3B82F6',
        secondaryColor: '#EF4444',
        loading: false
      });
    }
  }, [isAuthenticated, user?.team_id, fetchBranding, clearBrandingColors]);

  // Apply colors when branding changes
  useEffect(() => {
    if (!branding.loading && isAuthenticated) {
      applyBrandingColors();
    }
  }, [branding, isAuthenticated, applyBrandingColors]);

  // Update branding (for immediate feedback after changes)
  const updateBranding = useCallback((updates) => {
    setBranding((prev) => ({ ...prev, ...updates }));
  }, []);

  // Refresh branding from server
  const refreshBranding = useCallback(() => {
    fetchBranding();
  }, [fetchBranding]);

  const value = {
    ...branding,
    updateBranding,
    refreshBranding,
    isLoaded: !branding.loading
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
