import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTicketMutations } from '../hooks/useTickets';

export function TicketForm() {
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { createTicket } = useTicketMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      await createTicket.mutateAsync(description.trim());
      setDescription('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Add New Ticket
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter ticket description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={createTicket.isPending || !description.trim()}
              className="cursor-pointer"
            >
              {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setDescription('');
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
