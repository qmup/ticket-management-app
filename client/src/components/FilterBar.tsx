import { Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTicketsStore } from '../stores/ticketsStore';

export function FilterBar() {
  const { filter, searchQuery, setFilter, setSearchQuery } = useTicketsStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border-b">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          <Filter className="h-4 w-4 mr-2" />
          All
        </Button>
        <Button
          variant={filter === 'incomplete' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('incomplete')}
        >
          Incomplete
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed
        </Button>
      </div>
    </div>
  );
}
