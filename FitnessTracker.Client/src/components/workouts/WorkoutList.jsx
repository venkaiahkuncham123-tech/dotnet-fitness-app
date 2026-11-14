import { useState, useEffect } from 'react';
import { workoutsApi, usersApi } from '../../api';
import WorkoutForm from './WorkoutForm';

export default function WorkoutList({ userId, onBack }) {
  const [workouts, setWorkouts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    load();
  }, [userId]);

  async function load() {
    setLoading(true);
    try {
      const data = userId ? await workoutsApi.getByUserId(userId) : await workoutsApi.getAll();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData) {
    try {
      await workoutsApi.create(formData);
      setFlash({ type: 'success', message: 'Workout created' });
      setOpen(false);
      load();
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Create failed' });
    }
  }

  async function handleUpdate(id, formData) {
    try {
      await workoutsApi.update(id, formData);
      setFlash({ type: 'success', message: 'Workout updated' });
      setEditing(null);
      load();
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Update failed' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await workoutsApi.delete(id);
      setFlash({ type: 'success', message: 'Workout deleted' });
      load();
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Delete failed' });
    }
  }

  if (loading) return <div className="card empty">Loading workouts...</div>;
  if (error) return <div className="card empty">{error}</div>;

  return (
    <div className="page">
      {flash && (
        <div className={`flash ${flash.type}`} onClick={() => setFlash(null)}>
          {flash.message}
        </div>
      )}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h2>{userId ? 'User Workouts' : 'Workouts'}</h2>
            <p className="small">Workout sessions with exercises and sets.</p>
          </div>
          <div className="actions">
            {userId && (
              <button onClick={onBack} style={{ background: '#fff', color: 'var(--muted)' }}>
                ← Back to Users
              </button>
            )}
            <button className="primary" onClick={() => { setEditing(null); setOpen(true); }}>
              + Add Workout
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Calories</th>
              <th>Exercises</th>
              <th className="mono" style={{ width: '170px' }}>ID</th>
              <th style={{ width: '200px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{new Date(w.date).toLocaleDateString()}</td>
                <td>{w.durationMinutes} min</td>
                <td>{w.caloriesBurned}</td>
                <td>{w.exercises?.length || 0}</td>
                <td className="mono">{w.id}</td>
                <td>
                  <div className="actions" style={{ gap: '0.4rem' }}>
                    <button onClick={() => { setEditing(w); setOpen(true); }}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(w.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {workouts.length === 0 && <div className="empty">No workouts found.</div>}
      </div>

      {open && (
        <WorkoutForm
          users={users}
          mode={editing ? 'edit' : 'create'}
          workout={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={editing ? (d) => handleUpdate(editing.id, d) : handleCreate}
        />
      )}
    </div>
  );
}
