import { useState, useEffect } from 'react';
import { usersApi } from '../../api';

export default function WorkoutForm({ users, mode, workout, onClose, onSave }) {
  const [usersList, setUsersList] = useState(users || []);
  const [form, setForm] = useState({
    userId: workout?.userId || '',
    name: workout?.name || '',
    date: workout?.date ? new Date(workout.date).toISOString().slice(0, 16) : '',
    durationMinutes: workout?.durationMinutes || '',
    caloriesBurned: workout?.caloriesBurned || '',
    notes: workout?.notes || '',
    exercises: (workout?.exercises || []).map((ex) => ({
      name: ex.name || '',
      muscleGroup: ex.muscleGroup || '',
      sets: (ex.sets || []).map((s) => ({
        reps: s.reps || '',
        weightKg: s.weightKg || '',
        restSeconds: s.restSeconds || '',
      })),
    })),
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!usersList.length) {
      usersApi.getAll().then((data) => setUsersList(data)).catch(() => {});
    }
  }, []);

  const addExercise = () => {
    setForm((f) => ({
      ...f,
      exercises: [...f.exercises, { name: '', muscleGroup: '', sets: [] }],
    }));
  };

  const removeExercise = (index) => {
    setForm((f) => {
      const ex = [...f.exercises];
      ex.splice(index, 1);
      return { ...f, exercises: ex };
    });
  };

  const addSet = (exIndex) => {
    setForm((f) => {
      const ex = [...f.exercises];
      ex[exIndex].sets = [...ex[exIndex].sets, { reps: '', weightKg: '', restSeconds: '' }];
      return { ...f, exercises: ex };
    });
  };

  const removeSet = (exIndex, setIndex) => {
    setForm((f) => {
      const ex = [...f.exercises];
      ex[exIndex].sets.splice(setIndex, 1);
      return { ...f, exercises: ex };
    });
  };

  const updateField = (path, value) => {
    setForm((f) => {
      const next = { ...f };
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.userId) e.userId = 'User is required';
    if (!form.durationMinutes) e.durationMinutes = 'Duration is required';
    if (!form.caloriesBurned) e.caloriesBurned = 'Calories is required';
    form.exercises.forEach((ex, i) => {
      if (!ex.name) e[`ex${i}Name`] = 'Exercise name required';
      ex.sets.forEach((s, j) => {
        if (s.reps === '') e[`ex${i}set${j}reps`] = 'Reps required';
      });
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      userId: form.userId,
      name: form.name,
      date: form.date || new Date().toISOString(),
      durationMinutes: Number(form.durationMinutes) || 0,
      caloriesBurned: Number(form.caloriesBurned) || 0,
      notes: form.notes,
      exercises: form.exercises.map((ex) => ({
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: ex.sets.map((s) => ({
          reps: Number(s.reps) || 0,
          weightKg: Number(s.weightKg) || 0,
          restSeconds: Number(s.restSeconds) || 0,
        })),
      })),
    };
    onSave(payload).finally(() => setSubmitting(false));
  };
  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2>{mode === 'create' ? 'Create Workout' : 'Edit Workout'}</h2>
      {errors._global && <div className="flash error">{errors._global}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div className="form-grid">
          <div>
            <label>User</label>
            <select required value={form.userId} onChange={(e) => updateField('userId', e.target.value)}>
              <option value="">Select user</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            {errors.userId && <div className="small" style={{ color: 'var(--danger)' }}>{errors.userId}</div>}
          </div>
          <div>
            <label>Name</label>
            <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            {errors.name && <div className="small" style={{ color: 'var(--danger)' }}>{errors.name}</div>}
          </div>
          <div className="form-col">
            <label>Date & time</label>
            <input type="datetime-local" value={form.date} onChange={(e) => updateField('date', e.target.value)} />
          </div>
          <div>
            <label>Duration (minutes)</label>
            <input type="number" value={form.durationMinutes} onChange={(e) => updateField('durationMinutes', e.target.value)} />
            {errors.durationMinutes && <div className="small" style={{ color: 'var(--danger)' }}>{errors.durationMinutes}</div>}
          </div>
          <div>
            <label>Calories burned</label>
            <input type="number" value={form.caloriesBurned} onChange={(e) => updateField('caloriesBurned', e.target.value)} />
            {errors.caloriesBurned && <div className="small" style={{ color: 'var(--danger)' }}>{errors.caloriesBurned}</div>}
          </div>
          <div className="form-col">
            <label>Notes</label>
            <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', background: '#f8fafc' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Exercises</h3>
          {form.exercises.map((ex, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
              <div>
                <label className="small">Exercise name</label>
                <input value={ex.name} onChange={(e) => updateField(`exercises.${i}.name`, e.target.value)} />
                {errors[`ex${i}Name`] && <div className="small" style={{ color: 'var(--danger)', marginTop: '0.2rem' }}>{errors[`ex${i}Name`]}</div>}
              </div>
              <div>
                <label className="small">Muscle group</label>
                <input value={ex.muscleGroup} onChange={(e) => updateField(`exercises.${i}.muscleGroup`, e.target.value)} />
              </div>
              <button type="button" className="danger" onClick={() => removeExercise(i)} style={{ padding: '0.45rem', fontSize: '0.8rem' }}>Remove</button>
              <div className="form-col" style={{ gridColumn: 1 / -1 }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Sets</strong>
                  <button type="button" onClick={() => addSet(i)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>+ Add set</button>
                </div>
                {ex.sets.map((s, j) => (
                  <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <input placeholder="Reps" value={s.reps} onChange={(e) => updateField(`exercises.${i}.sets.${j}.reps`, e.target.value)} />
                    <input placeholder="Weight (kg)" value={s.weightKg} onChange={(e) => updateField(`exercises.${i}.sets.${j}.weightKg`, e.target.value)} />
                    <input placeholder="Rest (s)" value={s.restSeconds} onChange={(e) => updateField(`exercises.${i}.sets.${j}.restSeconds`, e.target.value)} />
                    <button type="button" className="danger" onClick={() => removeSet(i, j)} style={{ padding: '0.2rem', fontSize: '0.8rem' }}>×</button>
                  </div>
                ))}
                {errors[`ex${i}set0reps`] && <div className="small" style={{ color: 'var(--danger)' }}>{errors[`ex${i}set0reps`]}</div>}
              </div>
            </div>
          ))}
          <button type="button" onClick={addExercise} style={{ width: 'fit-content', padding: '0.4rem 0.9rem', fontSize: '0.9rem' }}>
            + Add exercise
          </button>
        </div>

        <div className="actions" style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'create' ? 'Create Workout' : 'Update Workout'}
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

