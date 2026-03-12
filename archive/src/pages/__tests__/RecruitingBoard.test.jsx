import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import RecruitingBoard from '../RecruitingBoard';

// Mock the API module
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const createTestQueryClient = () => new QueryClient({
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
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('RecruitingBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders recruiting board header', async () => {
    const mockApi = await import('../../services/api');

    // Mock API responses
    mockApi.default.get
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: []
        }
      });

    render(
      <TestWrapper>
        <RecruitingBoard />
      </TestWrapper>
    );

    // Check that the header renders
    expect(screen.getByText('Recruiting Board')).toBeInTheDocument();
    expect(screen.getByText('View and manage your recruiting targets and prospects')).toBeInTheDocument();
  });

  test('handles empty recruits data without errors', async () => {
    const mockApi = await import('../../services/api');

    // Mock empty responses
    mockApi.default.get
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: []
        }
      });

    render(
      <TestWrapper>
        <RecruitingBoard />
      </TestWrapper>
    );

    // Wait for the component to load and check that stats show 0
    await waitFor(() => {
      expect(screen.getByText('Total Recruits')).toBeInTheDocument();
    });

    // Check that all stats cards show 0 for empty data
    const totalRecruits = screen.getByText('Total Recruits').parentElement;
    expect(totalRecruits).toHaveTextContent('0');

    const highInterest = screen.getByText('High Interest').parentElement;
    expect(highInterest).toHaveTextContent('0');

    const scheduledVisits = screen.getByText('Scheduled Visits').parentElement;
    expect(scheduledVisits).toHaveTextContent('0');

    const scholarshipOffers = screen.getByText('Scholarship Offers').parentElement;
    expect(scholarshipOffers).toHaveTextContent('0');
  });

  test('handles malformed preference lists data without throwing errors', async () => {
    const mockApi = await import('../../services/api');

    // Mock responses where preference lists return unexpected format
    mockApi.default.get
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            { id: 1, first_name: 'John', last_name: 'Doe', position: 'SS' }
          ],
          pagination: { page: 1, limit: 20, total: 1, pages: 1 }
        }
      })
      .mockResolvedValueOnce({
        // This should not cause an error even though it's not an array
        data: null
      });

    // This should not throw an error
    expect(() => {
      render(
        <TestWrapper>
          <RecruitingBoard />
        </TestWrapper>
      );
    }).not.toThrow();

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Recruiting Board')).toBeInTheDocument();
    });

    // Stats should still render with safe fallbacks
    await waitFor(() => {
      expect(screen.getByText('Total Recruits')).toBeInTheDocument();
    });
  });

  test('handles preference lists data in different formats', async () => {
    const mockApi = await import('../../services/api');

    // Mock responses with preference lists data
    mockApi.default.get
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        }
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            { id: 1, player_id: 1, interest_level: 'High', visit_scheduled: true, scholarship_offered: false },
            { id: 2, player_id: 2, interest_level: 'Medium', visit_scheduled: false, scholarship_offered: true }
          ]
        }
      });

    render(
      <TestWrapper>
        <RecruitingBoard />
      </TestWrapper>
    );

    // Wait for the component to load and check stats
    await waitFor(() => {
      expect(screen.getByText('High Interest')).toBeInTheDocument();
    });

    // Check that stats are calculated correctly
    await waitFor(() => {
      const highInterest = screen.getByText('High Interest').parentElement;
      expect(highInterest).toHaveTextContent('1');

      const scheduledVisits = screen.getByText('Scheduled Visits').parentElement;
      expect(scheduledVisits).toHaveTextContent('1');

      const scholarshipOffers = screen.getByText('Scholarship Offers').parentElement;
      expect(scholarshipOffers).toHaveTextContent('1');
    });
  });
});
