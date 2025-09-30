import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTickets } from '../useTickets';

// Mock the API
jest.mock('../../services/api', () => ({
  ticketsApi: {
    getAll: jest.fn().mockResolvedValue([
      { id: 1, description: 'Test ticket 1', assigneeId: null, completed: false },
      { id: 2, description: 'Test ticket 2', assigneeId: 1, completed: true },
    ]),
  },
}));

// Mock the store
jest.mock('../../stores/ticketsStore', () => ({
  useTicketsStore: () => ({
    setTickets: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTickets', () => {
  it('fetches tickets successfully', async () => {
    const { result } = renderHook(() => useTickets(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]).toMatchObject({
      id: 1,
      description: 'Test ticket 1',
      completed: false,
    });
  });

  it('handles loading state', () => {
    const { result } = renderHook(() => useTickets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
