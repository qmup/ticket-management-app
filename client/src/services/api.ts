import { Ticket, User } from '@acme/shared-models';

const API_BASE_URL = '/api';

// Generic API error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      `Network error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

// Tickets API
export const ticketsApi = {
  // Get all tickets
  getAll: (): Promise<Ticket[]> => apiRequest<Ticket[]>('/tickets'),

  // Get single ticket
  getById: (id: number): Promise<Ticket> =>
    apiRequest<Ticket>(`/tickets/${id}`),

  // Create new ticket
  create: (description: string): Promise<Ticket> =>
    apiRequest<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify({ description }),
    }),

  // Assign user to ticket
  assign: (ticketId: number, userId: number): Promise<void> =>
    apiRequest<void>(`/tickets/${ticketId}/assign/${userId}`, {
      method: 'PUT',
    }),

  // Unassign user from ticket
  unassign: (ticketId: number): Promise<void> =>
    apiRequest<void>(`/tickets/${ticketId}/unassign`, {
      method: 'PUT',
    }),

  // Mark ticket as complete
  complete: (ticketId: number): Promise<void> =>
    apiRequest<void>(`/tickets/${ticketId}/complete`, {
      method: 'PUT',
    }),

  // Mark ticket as incomplete
  incomplete: (ticketId: number): Promise<void> =>
    apiRequest<void>(`/tickets/${ticketId}/complete`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  // Get all users
  getAll: (): Promise<User[]> => apiRequest<User[]>('/users'),

  // Get single user
  getById: (id: number): Promise<User> => apiRequest<User>(`/users/${id}`),
};
