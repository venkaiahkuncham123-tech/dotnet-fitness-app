import { useState, useEffect } from 'react';
import { usersApi } from '../../api';
import UserForm from './UserForm';

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData) {
    try {
      await usersApi.create(formData);
      setFlash({ type: 'success', message: 'User created' });
      setOpen(false);
      loadUsers();
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Create failed' });
    }
  }

  async function handleUpdate(id, formData) {
    try {
      await usersApi.update(id, formData);
      setFlash({ type: 'success', message: 'User updated' });
      setEditing(null);
      loadUsers();
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Update failed' });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    try {
      await usersApi.delete(id);
      setFlash({ type: 'success', message: 'User deleted' });
      loadUsers();
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Delete failed' });
    }
  }

  if (loading) return <div className="card empty">Loading users...</div>;
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
          <h2>Users</h2>
          <button className="primary" onClick={() => { setEditing(null); setOpen(true); }}>
            + Add User
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th className="mono" style={{ width: '220px' }}>ID</th>
              <th style={{ width: '210px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="mono">{u.id}</td>
                <td>
                  <div className="actions" style={{ gap: '0.4rem' }}>
                    <button onClick={() => onSelectUser(u.id)}>Workouts</button>
                    <button onClick={() => { setEditing(u); setOpen(true); }}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="empty">No users found.</div>}
      </div>

      {open && (
        <UserForm
          mode={editing ? 'edit' : 'create'}
          user={editing}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={editing ? (d) => handleUpdate(editing.id, d) : handleCreate}
        />
      )}
    </div>
  );
}
