/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';

type Frequency =
  | 'Once daily'
  | 'Twice daily'
  | 'Three times daily'
  | 'Weekly'
  | 'As needed';

interface Medication {
  medicationId: string;
  medicationName: string;
  dosage: string;         // e.g., "500 mg"
  frequency: Frequency;   // e.g., "Twice daily"
  startDate?: string;     // ISO date
  notes?: string;
}

const BRAND = '#C4E1E1';
const STORAGE_KEY = 'patient_medications_dummy';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Seed data for first run
const seedMeds: Medication[] = [
  {
    medicationId: makeId(),
    medicationName: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice daily',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    notes: 'Take with meals',
  },
  {
    medicationId: makeId(),
    medicationName: 'Atorvastatin',
    dosage: '20 mg',
    frequency: 'Once daily',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  },
  {
    medicationId: makeId(),
    medicationName: 'Albuterol Inhaler',
    dosage: '2 puffs',
    frequency: 'As needed',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    notes: 'For wheezing or shortness of breath',
  },
];

export default function MedicationsPage() {
  const { user } = useAuthHooks();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [draft, setDraft] = useState<Pick<Medication, 'medicationName' | 'dosage' | 'frequency' | 'startDate' | 'notes'>>({
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    startDate: '',
    notes: '',
  });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Pick<Medication, 'medicationName' | 'dosage' | 'frequency' | 'startDate' | 'notes'>>({
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    startDate: '',
    notes: '',
  });

  // Simple search
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medications;
    return medications.filter((m) =>
      [m.medicationName, m.dosage, m.frequency, m.notes ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [medications, query]);

  // Load from localStorage or seed
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMedications(JSON.parse(raw));
      } else {
        setMedications(seedMeds);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMeds));
      }
    } catch {
      setError('Failed to load medications from local storage.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Persist on change
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch {
      // ignore write errors
    }
  }, [medications, user]);

  if (!user) return null;

  // CRUD handlers
  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!draft.medicationName.trim()) return setError('Medication name is required.');
    if (!draft.dosage.trim()) return setError('Dosage is required.');

    const entry: Medication = {
      medicationId: makeId(),
      medicationName: draft.medicationName.trim(),
      dosage: draft.dosage.trim(),
      frequency: draft.frequency,
      startDate: draft.startDate || undefined,
      notes: draft.notes?.trim() || undefined,
    };

    setMedications((prev) => [entry, ...prev]);
    setDraft({ medicationName: '', dosage: '', frequency: 'Once daily', startDate: '', notes: '' });
  };

  const startEdit = (m: Medication) => {
    setEditingId(m.medicationId);
    setEditDraft({
      medicationName: m.medicationName,
      dosage: m.dosage,
      frequency: m.frequency,
      startDate: m.startDate ? m.startDate.slice(0, 10) : '',
      notes: m.notes ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ medicationName: '', dosage: '', frequency: 'Once daily', startDate: '', notes: '' });
  };

  const saveEdit = (id: string) => {
    if (!editDraft.medicationName.trim()) return setError('Medication name is required.');
    if (!editDraft.dosage.trim()) return setError('Dosage is required.');

    setMedications((prev) =>
      prev.map((m) =>
        m.medicationId === id
          ? {
              ...m,
              medicationName: editDraft.medicationName.trim(),
              dosage: editDraft.dosage.trim(),
              frequency: editDraft.frequency,
              startDate: editDraft.startDate ? new Date(editDraft.startDate).toISOString() : undefined,
              notes: editDraft.notes?.trim() || undefined,
            }
          : m
      )
    );
    cancelEdit();
  };

  const deleteMedication = (id: string) => {
    if (!confirm('Delete this medication?')) return;
    setMedications((prev) => prev.filter((m) => m.medicationId !== id));
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
        <h1 className="text-2xl font-semibold tracking-tight">Medications</h1>
        <p className="mt-1 text-gray-600">
          Manage your medications,{' '}
          <span className="font-medium">
            {user.profile.firstName} {user.profile.lastName}
          </span>
          .
        </p>
      </header>

      {/* Alerts */}
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
            <span className="text-base font-medium text-gray-800">Add new medication</span>
            <span className="text-xs text-gray-500 group-open:opacity-60">Collapse/Expand</span>
          </summary>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          <div className="p-5">
            <form onSubmit={addMedication} className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={draft.medicationName}
                  onChange={(e) => setDraft((s) => ({ ...s, medicationName: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="e.g., Metformin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dosage</label>
                <input
                  type="text"
                  value={draft.dosage}
                  onChange={(e) => setDraft((s) => ({ ...s, dosage: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="e.g., 500 mg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={draft.frequency}
                  onChange={(e) => setDraft((s) => ({ ...s, frequency: e.target.value as Frequency }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>Weekly</option>
                  <option>As needed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start date</label>
                <input
                  type="date"
                  value={draft.startDate}
                  onChange={(e) => setDraft((s) => ({ ...s, startDate: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <input
                  type="text"
                  value={draft.notes}
                  onChange={(e) => setDraft((s) => ({ ...s, notes: e.target.value }))}
                  className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="optional"
                />
              </div>
              <div className="md:col-span-5 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-[var(--brand)]/70 px-4 py-2.5 font-medium text-gray-900 ring-1 ring-[var(--brand)]/60 transition hover:bg-[var(--brand)]/90"
                >
                  Add medication
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
          placeholder="Search by name, dosage, frequency or note…"
          className="h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
      </div>

      {/* List */}
      <section className="mt-6 rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
        <h2 className="text-base font-medium text-gray-800">
          Your medications <span className="text-xs text-gray-500">({filtered.length})</span>
        </h2>

        {filtered.length === 0 ? (
          <p className="py-6 text-center text-gray-500">No medications yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/5">
            {filtered.map((m) => {
              const isEditing = editingId === m.medicationId;
              return (
                <li key={m.medicationId} className="py-4">
                  {!isEditing ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          {m.startDate ? new Date(m.startDate).toLocaleDateString() : '—'}
                        </p>
                        <p className="mt-0.5 text-base font-medium text-gray-900">
                          {m.medicationName}{' '}
                          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 ring-1 ring-black/10">
                            {m.dosage}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          {m.frequency}
                          {m.notes ? ` • ${m.notes}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(m)}
                          className="rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-900 ring-1 ring-yellow-200 hover:bg-yellow-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMedication(m.medicationId)}
                          className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-900 ring-1 ring-red-200 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-black/10 bg-white p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={editDraft.medicationName}
                            onChange={(e) => setEditDraft((s) => ({ ...s, medicationName: e.target.value }))}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dosage</label>
                          <input
                            type="text"
                            value={editDraft.dosage}
                            onChange={(e) => setEditDraft((s) => ({ ...s, dosage: e.target.value }))}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Frequency</label>
                          <select
                            value={editDraft.frequency}
                            onChange={(e) =>
                              setEditDraft((s) => ({ ...s, frequency: e.target.value as Frequency }))
                            }
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          >
                            <option>Once daily</option>
                            <option>Twice daily</option>
                            <option>Three times daily</option>
                            <option>Weekly</option>
                            <option>As needed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start date</label>
                          <input
                            type="date"
                            value={editDraft.startDate}
                            onChange={(e) => setEditDraft((s) => ({ ...s, startDate: e.target.value }))}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                        <div className="md:col-span-5">
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
                          onClick={() => saveEdit(m.medicationId)}
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
