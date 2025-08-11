/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';

type Severity = 'Mild' | 'Moderate' | 'Severe';

interface Allergy {
  allergyId: string;
  allergenName: string;
  reactionSeverity: Severity;
  notes?: string;
  recordedAt: string; // ISO date
}

const BRAND = '#C4E1E1';
const STORAGE_KEY = 'patient_allergies_dummy';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Seed data used only when nothing is in localStorage yet
const seedAllergies: Allergy[] = [
  {
    allergyId: makeId(),
    allergenName: 'Penicillin',
    reactionSeverity: 'Severe',
    notes: 'Anaphylaxis reported in 2018.',
    recordedAt: new Date().toISOString(),
  },
  {
    allergyId: makeId(),
    allergenName: 'Peanuts',
    reactionSeverity: 'Moderate',
    notes: 'Hives & swelling; carries antihistamine.',
    recordedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    allergyId: makeId(),
    allergenName: 'Pollen',
    reactionSeverity: 'Mild',
    notes: 'Seasonal rhinitis, springtime.',
    recordedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export default function AllergiesPage() {
  const { user } = useAuthHooks();
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state (create)
  const [newAllergy, setNewAllergy] = useState<Pick<Allergy, 'allergenName' | 'reactionSeverity' | 'notes'>>({
    allergenName: '',
    reactionSeverity: 'Mild',
    notes: '',
  });

  // edit state: which id is being edited + inline draft
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Pick<Allergy, 'allergenName' | 'reactionSeverity' | 'notes'>>({
    allergenName: '',
    reactionSeverity: 'Mild',
    notes: '',
  });

  // simple search filter (optional UX nicety)
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allergies;
    return allergies.filter(
      (a) =>
        a.allergenName.toLowerCase().includes(q) ||
        (a.notes ?? '').toLowerCase().includes(q) ||
        a.reactionSeverity.toLowerCase().includes(q)
    );
  }, [allergies, query]);

  // Load from localStorage (or seed) on mount
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Allergy[] = JSON.parse(raw);
        setAllergies(parsed);
      } else {
        setAllergies(seedAllergies);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAllergies));
      }
    } catch {
      setError('Failed to load allergies from local storage.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Persist to localStorage whenever allergies change
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allergies));
    } catch {
      // ignore write errors
    }
  }, [allergies, user]);

  if (!user) return null;

  const addAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newAllergy.allergenName.trim()) {
      setError('Allergen name is required.');
      return;
    }
    const entry: Allergy = {
      allergyId: makeId(),
      allergenName: newAllergy.allergenName.trim(),
      reactionSeverity: newAllergy.reactionSeverity,
      notes: newAllergy.notes?.trim(),
      recordedAt: new Date().toISOString(),
    };
    setAllergies((prev) => [entry, ...prev]);
    setNewAllergy({ allergenName: '', reactionSeverity: 'Mild', notes: '' });
  };

  const startEdit = (row: Allergy) => {
    setEditingId(row.allergyId);
    setEditDraft({
      allergenName: row.allergenName,
      reactionSeverity: row.reactionSeverity,
      notes: row.notes ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ allergenName: '', reactionSeverity: 'Mild', notes: '' });
  };

  const saveEdit = (id: string) => {
    if (!editDraft.allergenName.trim()) {
      setError('Allergen name is required.');
      return;
    }
    setAllergies((prev) =>
      prev.map((a) =>
        a.allergyId === id
          ? {
              ...a,
              allergenName: editDraft.allergenName.trim(),
              reactionSeverity: editDraft.reactionSeverity,
              notes: editDraft.notes?.trim(),
            }
          : a
      )
    );
    cancelEdit();
  };

  const deleteAllergy = (id: string) => {
    if (!confirm('Delete this allergy?')) return;
    setAllergies((prev) => prev.filter((a) => a.allergyId !== id));
  };

  return (
    <div
      className="p-6 text-gray-900"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mb-5 h-1 w-full rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--brand) 22%, var(--brand) 78%, transparent 100%)',
        }}
        aria-hidden
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Allergies</h1>
        <p className="mt-1 text-gray-600">
          Manage your allergies,{' '}
          <span className="font-medium">
            {user.profile.firstName} {user.profile.lastName}
          </span>
          .
        </p>
      </header>

      {/* Notifications */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 rounded-xl border border-black/5 bg-white/80 p-4 text-sm text-gray-600 shadow-sm backdrop-blur">
          Loading...
        </div>
      )}

      {/* Create */}
      <section className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
        <details open className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
            <span className="text-base font-medium text-gray-800">Add new allergy</span>
            <span className="text-xs text-gray-500 group-open:opacity-60">Collapse/Expand</span>
          </summary>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <div className="p-5">
            <form onSubmit={addAllergy} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Allergen</label>
                <input
                  type="text"
                  value={newAllergy.allergenName}
                  onChange={(e) => setNewAllergy((s) => ({ ...s, allergenName: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="e.g., Penicillin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                <select
                  value={newAllergy.reactionSeverity}
                  onChange={(e) =>
                    setNewAllergy((s) => ({ ...s, reactionSeverity: e.target.value as Severity }))
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <input
                  type="text"
                  value={newAllergy.notes}
                  onChange={(e) => setNewAllergy((s) => ({ ...s, notes: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="optional"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-[var(--brand)]/70 px-4 py-2.5 font-medium text-gray-900 ring-1 ring-[var(--brand)]/60 transition hover:bg-[var(--brand)]/90"
                >
                  Add allergy
                </button>
              </div>
            </form>
          </div>
        </details>
      </section>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by allergen, note or severity…"
          className="h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
      </div>

      {/* List */}
      <section className="mt-6 rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
        <h2 className="text-base font-medium text-gray-800">
          Your allergies <span className="text-xs text-gray-500">({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No allergies yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/5">
            {filtered.map((a) => {
              const isEditing = editingId === a.allergyId;
              return (
                <li key={a.allergyId} className="py-4">
                  {!isEditing ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(a.recordedAt).toLocaleDateString()}
                        </p>
                        <p className="mt-0.5 text-base font-medium text-gray-900">
                          {a.allergenName}{' '}
                          <span
                            className={[
                              'ml-2 rounded-full px-2 py-0.5 text-xs ring-1',
                              a.reactionSeverity === 'Severe'
                                ? 'bg-red-100 text-red-800 ring-red-200'
                                : a.reactionSeverity === 'Moderate'
                                ? 'bg-yellow-100 text-yellow-800 ring-yellow-200'
                                : 'bg-green-100 text-green-800 ring-green-200',
                            ].join(' ')}
                          >
                            {a.reactionSeverity}
                          </span>
                        </p>
                        {a.notes && <p className="text-sm text-gray-700">{a.notes}</p>}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(a)}
                          className="rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-900 ring-1 ring-yellow-200 hover:bg-yellow-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAllergy(a.allergyId)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-900 ring-1 ring-red-200 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-black/10 bg-white p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Allergen</label>
                          <input
                            type="text"
                            value={editDraft.allergenName}
                            onChange={(e) =>
                              setEditDraft((s) => ({ ...s, allergenName: e.target.value }))
                            }
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Severity</label>
                          <select
                            value={editDraft.reactionSeverity}
                            onChange={(e) =>
                              setEditDraft((s) => ({
                                ...s,
                                reactionSeverity: e.target.value as Severity,
                              }))
                            }
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          >
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Severe">Severe</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Notes</label>
                          <input
                            type="text"
                            value={editDraft.notes}
                            onChange={(e) => setEditDraft((s) => ({ ...s, notes: e.target.value }))}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => saveEdit(a.allergyId)}
                          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
