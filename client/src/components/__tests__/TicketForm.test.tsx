import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TicketForm } from '../TicketForm';

// Mock the useTicketMutations hook
jest.mock('../../hooks/useTickets', () => ({
  useTicketMutations: () => ({
    createTicket: {
      mutateAsync: jest.fn(),
      isPending: false,
    },
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

describe('TicketForm', () => {
  it('renders add button initially', () => {
    render(<TicketForm />, { wrapper: createWrapper() });
    expect(screen.getByText('Add New Ticket')).toBeInTheDocument();
  });

  it('opens form when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<TicketForm />, { wrapper: createWrapper() });
    
    await user.click(screen.getByText('Add New Ticket'));
    
    expect(screen.getByText('Add New Ticket')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter ticket description...')).toBeInTheDocument();
  });

  it('closes form when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<TicketForm />, { wrapper: createWrapper() });
    
    await user.click(screen.getByText('Add New Ticket'));
    await user.click(screen.getByText('Cancel'));
    
    expect(screen.getByText('Add New Ticket')).toBeInTheDocument();
  });

  it('disables submit button when description is empty', async () => {
    const user = userEvent.setup();
    render(<TicketForm />, { wrapper: createWrapper() });
    
    await user.click(screen.getByText('Add New Ticket'));
    
    const submitButton = screen.getByText('Create Ticket');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when description is provided', async () => {
    const user = userEvent.setup();
    render(<TicketForm />, { wrapper: createWrapper() });
    
    await user.click(screen.getByText('Add New Ticket'));
    await user.type(screen.getByPlaceholderText('Enter ticket description...'), 'Test ticket');
    
    const submitButton = screen.getByText('Create Ticket');
    expect(submitButton).not.toBeDisabled();
  });
});
