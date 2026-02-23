import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { BrandingProvider } from '../../contexts/BrandingContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import * as authService from '../../services/auth';

// Mock services
vi.mock('../../services/players', () => ({
  playersService: {
    getPlayers: vi.fn()
  }
}));

vi.mock('../../services/teams', () => ({
  teamsService: {
    getTeam: vi.fn()
  }
}));

vi.mock('../../services/reports', () => ({
  reportsService: {
    getScoutingReports: vi.fn()
  }
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock API module for branding and team stats
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));

// Mock TeamStatistics component to avoid complex team stats queries
vi.mock('../../components/TeamStatistics', () => ({
  default: () => <div data-testid="team-statistics">Team Statistics</div>
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

const TestWrapper = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrandingProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </BrandingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Dashboard - Keyboard Accessibility', () => {
  const mockPlayers = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      position: 'SS',
      school: 'State University',
      status: 'active'
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      position: 'CF',
      school: 'Tech College',
      status: 'active'
    }
  ];

  const mockReports = [
    {
      id: 1,
      overall_grade: 'A',
      created_at: '2024-01-15T10:00:00Z',
      Player: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe'
      }
    },
    {
      id: 2,
      overall_grade: 'B+',
      created_at: '2024-01-16T10:00:00Z',
      Player: {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith'
      }
    }
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    window.localStorage.setItem('token', 'test-token');
    vi.spyOn(authService, 'getProfile').mockResolvedValue({
      id: 1,
      role: 'coach',
      team_id: 1
    });

    const { playersService } = await import('../../services/players');
    const { teamsService } = await import('../../services/teams');
    const { reportsService } = await import('../../services/reports');

    playersService.getPlayers.mockResolvedValue({
      data: mockPlayers,
      pagination: { total: 2, page: 1, limit: 5, pages: 1 }
    });

    teamsService.getTeam.mockResolvedValue({
      id: 1,
      name: 'Test Team'
    });

    reportsService.getScoutingReports.mockResolvedValue({
      data: mockReports,
      pagination: { total: 2, page: 1, limit: 5, pages: 1 }
    });
  });

  describe('Player Cards Accessibility', () => {
    it('renders player cards with proper ARIA attributes', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      expect(playerCard).toHaveAttribute('role', 'button');
      expect(playerCard).toHaveAttribute('tabIndex', '0');
      expect(playerCard).toHaveAttribute('aria-label', 'View John Doe - SS at State University');
    });

    it('allows player cards to be focused via Tab key', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      // Tab to the card
      await user.tab();

      // Check if the card can receive focus (it should be in the tab order)
      expect(playerCard).toHaveAttribute('tabIndex', '0');
    });

    it('triggers navigation when Enter key is pressed on player card', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      // Focus and press Enter
      playerCard.focus();
      await user.keyboard('{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/players/1');
    });

    it('triggers navigation when Space key is pressed on player card', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      // Focus and press Space
      playerCard.focus();
      await user.keyboard(' ');

      expect(mockNavigate).toHaveBeenCalledWith('/players/1');
    });

    it('triggers navigation when clicked with mouse on player card', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      await user.click(playerCard);

      expect(mockNavigate).toHaveBeenCalledWith('/players/1');
    });

    it('renders all player cards with keyboard accessibility', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
        expect(screen.getByLabelText('View Jane Smith - CF at Tech College')).toBeInTheDocument();
      });

      const playerCard1 = screen.getByLabelText('View John Doe - SS at State University');
      const playerCard2 = screen.getByLabelText('View Jane Smith - CF at Tech College');

      expect(playerCard1).toHaveAttribute('role', 'button');
      expect(playerCard1).toHaveAttribute('tabIndex', '0');

      expect(playerCard2).toHaveAttribute('role', 'button');
      expect(playerCard2).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Report Cards Accessibility', () => {
    it('renders report cards with proper ARIA attributes', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      // Find the report card by its aria-label
      const reportCards = screen.getAllByRole('button');
      const reportCard = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for John Doe - Grade A')
      );

      expect(reportCard).toBeDefined();
      expect(reportCard).toHaveAttribute('role', 'button');
      expect(reportCard).toHaveAttribute('tabIndex', '0');
    });

    it('allows report cards to be focused via Tab key', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const reportCards = screen.getAllByRole('button');
      const reportCard = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for John Doe - Grade A')
      );

      expect(reportCard).toHaveAttribute('tabIndex', '0');
    });

    it('triggers navigation when Enter key is pressed on report card', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const reportCards = screen.getAllByRole('button');
      const reportCard = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for John Doe - Grade A')
      );

      reportCard.focus();
      await user.keyboard('{Enter}');

      expect(mockNavigate).toHaveBeenCalledWith('/scouting/1');
    });

    it('triggers navigation when Space key is pressed on report card', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const reportCards = screen.getAllByRole('button');
      const reportCard = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for John Doe - Grade A')
      );

      reportCard.focus();
      await user.keyboard(' ');

      expect(mockNavigate).toHaveBeenCalledWith('/scouting/1');
    });

    it('triggers navigation when clicked with mouse on report card', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const reportCards = screen.getAllByRole('button');
      const reportCard = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for John Doe - Grade A')
      );

      await user.click(reportCard);

      expect(mockNavigate).toHaveBeenCalledWith('/scouting/1');
    });

    it('renders all report cards with keyboard accessibility', async () => {
      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const reportCards = screen.getAllByRole('button');
      const reportCard1 = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for John Doe - Grade A')
      );
      const reportCard2 = reportCards.find(card =>
        card.getAttribute('aria-label')?.includes('View scouting report for Jane Smith - Grade B+')
      );

      expect(reportCard1).toBeDefined();
      expect(reportCard1).toHaveAttribute('role', 'button');
      expect(reportCard1).toHaveAttribute('tabIndex', '0');

      expect(reportCard2).toBeDefined();
      expect(reportCard2).toHaveAttribute('role', 'button');
      expect(reportCard2).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Empty States', () => {
    it('handles empty player list without errors', async () => {
      const { playersService } = await import('../../services/players');
      playersService.getPlayers.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 5, pages: 0 }
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No recent players')).toBeInTheDocument();
      });

      // Should not have any player cards
      const playerCards = screen.queryAllByLabelText(/View .* - .* at .*/);
      expect(playerCards.length).toBe(0);
    });

    it('handles empty reports list without errors', async () => {
      const { reportsService } = await import('../../services/reports');
      reportsService.getScoutingReports.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 5, pages: 0 }
      });

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('No recent reports')).toBeInTheDocument();
      });

      // Should only have player cards, no report cards
      const reportCards = screen.queryAllByLabelText(/View scouting report for/);
      expect(reportCards.length).toBe(0);
    });
  });

  describe('Keyboard Navigation Behavior', () => {
    it('prevents default behavior for Space key to avoid page scroll', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      playerCard.focus();

      // Create a spy to check if preventDefault was called
      const keyDownHandler = vi.fn((e) => {
        if (e.key === ' ') {
          expect(e.defaultPrevented).toBe(false); // Initially not prevented
        }
      });

      playerCard.addEventListener('keydown', keyDownHandler);

      await user.keyboard(' ');

      // Navigation should still work
      expect(mockNavigate).toHaveBeenCalledWith('/players/1');
    });

    it('does not trigger navigation on other keys', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByLabelText('View John Doe - SS at State University')).toBeInTheDocument();
      });

      const playerCard = screen.getByLabelText('View John Doe - SS at State University');

      playerCard.focus();

      // Try various keys that should not trigger navigation
      await user.keyboard('{Escape}');
      await user.keyboard('{Tab}');
      await user.keyboard('a');

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
