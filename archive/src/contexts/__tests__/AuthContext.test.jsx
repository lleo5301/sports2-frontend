import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as authService from '../../services/auth';
import api from '../../services/api';

const TestConsumer = () => {
  const { user, loading, login, logout, updateUser, isAuthenticated, isHeadCoach } = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="isAuthenticated">{String(isAuthenticated)}</div>
      <div data-testid="isHeadCoach">{String(isHeadCoach)}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : ''}</div>
      {/* UPDATED: login() no longer accepts token parameter */}
      <button onClick={() => login({ id: 1, role: 'head_coach' })}>login</button>
      <button onClick={() => logout()}>logout</button>
      <button onClick={() => updateUser({ id: 1, role: 'assistant' })}>updateUser</button>
    </div>
  );
};

describe('AuthContext', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('initializes without authenticated user', async () => {
    vi.spyOn(authService, 'getProfile').mockRejectedValue(new Error('No session'));

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
  });

  it('loads profile when valid cookie exists', async () => {
    vi.spyOn(authService, 'getProfile').mockResolvedValue({ id: 10, role: 'head_coach' });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual({ id: 10, role: 'head_coach' });
  });

  it('login sets user from userData', async () => {
    vi.spyOn(authService, 'getProfile').mockRejectedValue(new Error('No session'));

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    // UPDATED: login() now only accepts userData (JWT is in httpOnly cookie from backend)
    screen.getByText('login').click();

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
      expect(screen.getByTestId('isHeadCoach').textContent).toBe('true');
    });

    // Note: No localStorage assertions - JWT is in httpOnly cookie (not accessible from JS)
  });

  it('logout clears user and calls backend endpoint', async () => {
    vi.spyOn(authService, 'getProfile').mockResolvedValue({ id: 1, role: 'head_coach' });
    const logoutSpy = vi.spyOn(api, 'post').mockResolvedValue({});

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    // User should be authenticated
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');

    // Logout
    screen.getByText('logout').click();

    await waitFor(() => {
      // UPDATED: Verify backend logout endpoint is called
      expect(logoutSpy).toHaveBeenCalledWith('/auth/logout');

      // User should be logged out
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    });

    // Note: No localStorage assertions - cookies cleared by backend
  });

  it('updateUser updates user state', async () => {
    vi.spyOn(authService, 'getProfile').mockResolvedValue({ id: 1, role: 'head_coach' });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    screen.getByText('updateUser').click();

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).not.toBe('');
      expect(JSON.parse(screen.getByTestId('user').textContent)).toEqual({ id: 1, role: 'assistant' });
      expect(screen.getByTestId('isHeadCoach').textContent).toBe('false');
    });
  });
});
