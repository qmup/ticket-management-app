import { Ticket } from '@acme/shared-models';
import { CheckCircle, Circle, User, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UserSelector } from './UserSelector';
import { useTicketMutations } from '../hooks/useTickets';
import { useUsersStore } from '../stores/usersStore';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const { assignTicket, unassignTicket, completeTicket, incompleteTicket } =
    useTicketMutations();
  const { getUserById } = useUsersStore();
  const assignee = getUserById(ticket.assigneeId || 0);

  const handleAssign = async (userId: number | null) => {
    try {
      if (userId) {
        await assignTicket.mutateAsync({ ticketId: ticket.id, userId });
      } else {
        await unassignTicket.mutateAsync(ticket.id);
      }
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleToggleComplete = async () => {
    try {
      if (ticket.completed) {
        await incompleteTicket.mutateAsync(ticket.id);
      } else {
        await completeTicket.mutateAsync(ticket.id);
      }
    } catch (error) {
      console.error('Failed to toggle ticket completion:', error);
    }
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        ticket.completed ? 'opacity-75' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle
            className={`text-lg ${
              ticket.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            Ticket #{ticket.id}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleComplete}
            disabled={completeTicket.isPending || incompleteTicket.isPending}
            className="cursor-pointer"
          >
            {ticket.completed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p
          className={`text-gray-700 ${ticket.completed ? 'line-through' : ''}`}
        >
          {ticket.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{assignee ? assignee.name : 'Unassigned'}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span
              className={
                ticket.completed ? 'text-green-600' : 'text-orange-600'
              }
            >
              {ticket.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>

        <UserSelector
          selectedUserId={ticket.assigneeId}
          onUserSelect={handleAssign}
          ticketId={ticket.id}
        />

        <div className="pt-2 border-t">
          <Link to={`/${ticket.id}`}>
            <Button variant="outline" size="sm" className="w-full cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
