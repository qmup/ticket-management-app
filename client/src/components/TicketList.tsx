import { Ticket } from '@acme/shared-models';
import { TicketCard } from './TicketCard';
import { TicketForm } from './TicketForm';
import { FilterBar } from './FilterBar';
import { LoadingSpinner } from './LoadingSpinner';
import { useTicketsStore } from '../stores/ticketsStore';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  error?: Error | null;
}

export function TicketList({ tickets, isLoading, error }: TicketListProps) {
  const { getFilteredTickets } = useTicketsStore();
  const filteredTickets = getFilteredTickets();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Tickets</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FilterBar />
      
      <TicketForm />
      
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {tickets.length === 0 
                ? 'Create your first ticket above!' 
                : 'Try adjusting your filters or search terms.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
