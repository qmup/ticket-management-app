import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '../services/api';
import { useTicketsStore } from '../stores/ticketsStore';
import { Ticket } from '@acme/shared-models';

// Query keys for React Query
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...ticketKeys.lists(), { filters }] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: number) => [...ticketKeys.details(), id] as const,
};

// Hook to fetch all tickets
export function useTickets() {
  const { setTickets, setLoading, setError } = useTicketsStore();

  return useQuery({
    queryKey: ticketKeys.lists(),
    queryFn: async () => {
      setLoading(true);
      setError(null);
      try {
        const tickets = await ticketsApi.getAll();
        setTickets(tickets);
        return tickets;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch tickets';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch single ticket
export function useTicket(id: number) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for ticket mutations
export function useTicketMutations() {
  const queryClient = useQueryClient();
  const { addTicket, updateTicket } = useTicketsStore();

  // Create ticket mutation
  const createTicket = useMutation({
    mutationFn: (description: string) => ticketsApi.create(description),
    onSuccess: (newTicket) => {
      // Optimistically update local state
      addTicket(newTicket);
      // Invalidate and refetch tickets
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
    },
  });

  // Assign ticket mutation
  const assignTicket = useMutation({
    mutationFn: ({ ticketId, userId }: { ticketId: number; userId: number }) =>
      ticketsApi.assign(ticketId, userId),
    onSuccess: (_, { ticketId, userId }) => {
      // Optimistically update local state
      updateTicket(ticketId, { assigneeId: userId });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
    onError: (error) => {
      console.error('Failed to assign ticket:', error);
    },
  });

  // Unassign ticket mutation
  const unassignTicket = useMutation({
    mutationFn: (ticketId: number) => ticketsApi.unassign(ticketId),
    onSuccess: (_, ticketId) => {
      // Optimistically update local state
      updateTicket(ticketId, { assigneeId: null });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
    onError: (error) => {
      console.error('Failed to unassign ticket:', error);
    },
  });

  // Complete ticket mutation
  const completeTicket = useMutation({
    mutationFn: (ticketId: number) => ticketsApi.complete(ticketId),
    onSuccess: (_, ticketId) => {
      // Optimistically update local state
      updateTicket(ticketId, { completed: true });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
    onError: (error) => {
      console.error('Failed to complete ticket:', error);
    },
  });

  // Incomplete ticket mutation
  const incompleteTicket = useMutation({
    mutationFn: (ticketId: number) => ticketsApi.incomplete(ticketId),
    onSuccess: (_, ticketId) => {
      // Optimistically update local state
      updateTicket(ticketId, { completed: false });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
    onError: (error) => {
      console.error('Failed to mark ticket as incomplete:', error);
    },
  });

  return {
    createTicket,
    assignTicket,
    unassignTicket,
    completeTicket,
    incompleteTicket,
  };
}
