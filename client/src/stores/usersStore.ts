import { create } from 'zustand';
import { User } from '@acme/shared-models';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UsersActions {
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getUserById: (id: number) => User | undefined;
}

export const useUsersStore = create<UsersState & UsersActions>((set, get) => ({
  // State
  users: [],
  loading: false,
  error: null,

  // Actions
  setUsers: (users) => set({ users }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  getUserById: (id) => {
    const { users } = get();
    return users.find((user) => user.id === id);
  },
}));
