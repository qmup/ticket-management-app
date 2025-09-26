import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../services/api';
import { useUsersStore } from '../stores/usersStore';

// Query keys for users
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Hook to fetch all users
export function useUsers() {
  const { setUsers, setLoading, setError } = useUsersStore();

  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      setLoading(true);
      setError(null);
      try {
        const users = await usersApi.getAll();
        setUsers(users);
        return users;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch users';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (users don't change often)
  });
}

// Hook to fetch single user
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
