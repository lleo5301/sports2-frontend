import '@testing-library/jest-dom';
// Keep setup file strictly JS (no JSX) to avoid transform issues
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock window.matchMedia for components/libraries that rely on it
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Provide a simple localStorage mock for tests that touch tokens
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Tests should create their own QueryClientProvider wrappers as needed

// Auto-cleanup after each test
afterEach(() => {
  cleanup();
});

