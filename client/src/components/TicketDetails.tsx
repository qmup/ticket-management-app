import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, User, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LoadingSpinner } from './LoadingSpinner';
import { UserSelector } from './UserSelector';
import { useTicket } from '../hooks/useTickets';
import { useTicketMutations } from '../hooks/useTickets';
import { useUsersStore } from '../stores/usersStore';

export function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const ticketId = id ? parseInt(id, 10) : 0;

  const { data: ticket, isLoading, error } = useTicket(ticketId);
  const { assignTicket, unassignTicket, completeTicket, incompleteTicket } =
    useTicketMutations();
  const { getUserById } = useUsersStore();

  const handleAssign = async (userId: number | null) => {
    if (!ticket) return;

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
    if (!ticket) return;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Ticket Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            {error?.message || 'The ticket you are looking for does not exist.'}
          </p>
          <Link to="/">
            <Button className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const assignee = getUserById(ticket.assigneeId || 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle
              className={`text-xl ${
                ticket.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {ticket.description}
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
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Assignee</p>
                <p className="font-medium">
                  {assignee ? assignee.name : 'Unassigned'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`font-medium ${
                    ticket.completed ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {ticket.completed ? 'Completed' : 'In Progress'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <UserSelector
              selectedUserId={ticket.assigneeId}
              onUserSelect={handleAssign}
              ticketId={ticket.id}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
