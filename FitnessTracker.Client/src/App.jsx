import { useState } from 'react';
import Navbar from './components/Navbar';
import UserList from './components/users/UserList';
import WorkoutList from './components/workouts/WorkoutList';

export default function App() {
  const [page, setPage] = useState('users');
  const [filterUserId, setFilterUserId] = useState(null);

  return (
    <div className="page">
      <Navbar page={page} setPage={setPage} />
      <div className="container">
        {page === 'users' ? (
          <UserList onSelectUser={(id) => { setFilterUserId(id); setPage('workouts'); }} />
        ) : (
          <WorkoutList userId={filterUserId} onBack={() => { setFilterUserId(null); setPage('users'); }} />
        )}
      </div>
    </div>
  );
}
