export default function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" onClick={(e) => { e.preventDefault(); setPage('users'); }} className="brand">
          Fitness Tracker
        </a>
        <div className="nav-links">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('users'); }}
            className={page === 'users' ? 'active' : ''}
          >
            Users
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setPage('workouts'); }}
            className={page === 'workouts' ? 'active' : ''}
          >
            Workouts
          </a>
        </div>
      </div>
    </nav>
  );
}
