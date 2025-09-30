import { Routes, Route } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { TicketList } from '../components/TicketList';
import { TicketDetails } from '../components/TicketDetails';
import { ErrorBoundary } from '../components/ErrorBoundary';

const App = () => {
  // Initialize data fetching with React Query
  const {
    data: tickets,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useTickets();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();

  // Show loading state
  if (ticketsLoading || usersLoading) {
    return (
      <div className="p-4">
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 py-4">
                Ticketing App
              </h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Show error state
  if (ticketsError || usersError) {
    return (
      <div className="p-4">
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 py-4">
                Ticketing App
              </h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg text-red-600">
                Error loading data:{' '}
                {ticketsError?.message || usersError?.message}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 py-4">
                Ticketing App
              </h1>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <TicketList
                    tickets={tickets || []}
                    isLoading={ticketsLoading}
                    error={ticketsError}
                  />
                }
              />
              <Route path="/:id" element={<TicketDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
