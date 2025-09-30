import { User } from '@acme/shared-models';
import { Button } from './ui/button';
import { useUsersStore } from '../stores/usersStore';

interface UserSelectorProps {
  selectedUserId: number | null;
  onUserSelect: (userId: number | null) => void;
  ticketId: number;
}

export function UserSelector({
  selectedUserId,
  onUserSelect,
  ticketId,
}: UserSelectorProps) {
  const { users } = useUsersStore();
  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Assignee:</span>
      {selectedUser ? (
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
            {selectedUser.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUserSelect(null)}
          >
            Unassign
          </Button>
        </div>
      ) : (
        <div className="flex gap-1">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="outline"
              size="sm"
              onClick={() => onUserSelect(user.id)}
            >
              {user.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
