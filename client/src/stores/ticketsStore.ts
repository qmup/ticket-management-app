import { create } from 'zustand';
import { Ticket } from '@acme/shared-models';

interface TicketsState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'completed' | 'incomplete';
  searchQuery: string;
}

interface TicketsActions {
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: number, updates: Partial<Ticket>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: 'all' | 'completed' | 'incomplete') => void;
  setSearchQuery: (query: string) => void;
  getFilteredTickets: () => Ticket[];
}

export const useTicketsStore = create<TicketsState & TicketsActions>(
  (set, get) => ({
    // State
    tickets: [],
    loading: false,
    error: null,
    filter: 'all',
    searchQuery: '',

    // Actions
    setTickets: (tickets) => set({ tickets }),

    addTicket: (ticket) =>
      set((state) => ({
        tickets: [...state.tickets, ticket],
      })),

    updateTicket: (id, updates) =>
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id ? { ...ticket, ...updates } : ticket,
        ),
      })),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    setFilter: (filter) => set({ filter }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),

    getFilteredTickets: () => {
      const { tickets, filter, searchQuery } = get();

      let filtered = tickets;

      // Filter by status
      if (filter === 'completed') {
        filtered = filtered.filter((ticket) => ticket.completed);
      } else if (filter === 'incomplete') {
        filtered = filtered.filter((ticket) => !ticket.completed);
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter((ticket) =>
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      return filtered;
    },
  }),
);
