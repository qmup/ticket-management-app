import { Routes, Route } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';

import styles from './app.module.css';
import Tickets from './tickets/tickets';

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
      <div className={styles['app']}>
        <h1>Ticketing App</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (ticketsError || usersError) {
    return (
      <div className={styles['app']}>
        <h1>Ticketing App</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-lg text-red-600">
            Error loading data: {ticketsError?.message || usersError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['app']}>
      <h1>Ticketing App</h1>
      <Routes>
        <Route path="/" element={<Tickets tickets={tickets || []} />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<h2>Details Not Implemented</h2>} />
      </Routes>
    </div>
  );
};

export default App;
