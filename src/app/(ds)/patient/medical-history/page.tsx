/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
//@ts-nocheck

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api';

type HistoryItem = {
  historyId: string;
  conditionName: string;
  onsetDate?: string;     // ISO
  resolutionDate?: string;
  status?: 'active' | 'resolved' | 'ongoing' | string;
  notes?: string;
  severity?: 'mild' | 'moderate' | 'severe' | string;
  attachments?: Array<{ name: string; url?: string }>;
};

export default function MedicalHistoryPage() {
  const { user } = useAuthHooks();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  // UI-only state (doesn't change your backend behavior)
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved' | 'ongoing'>('all');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/patient/medical-history');
        setHistory(Array.isArray(response?.data?.data) ? response.data.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch medical history');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (!user) return null;

  const BRAND = '#C4E1E1';
  const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');

  const filtered = useMemo(() => {
    let list = [...history];

    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter(
        i =>
          (i.conditionName ?? '').toLowerCase().includes(query) ||
          (i.notes ?? '').toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      list = list.filter(i => (i.status ?? '').toLowerCase() === statusFilter);
    }
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => +(new Date(b.onsetDate ?? 0)) - +(new Date(a.onsetDate ?? 0)));
        break;
      case 'oldest':
        list.sort((a, b) => +(new Date(a.onsetDate ?? 0)) - +(new Date(b.onsetDate ?? 0)));
        break;
      case 'name':
        list.sort((a, b) => (a.conditionName ?? '').localeCompare(b.conditionName ?? ''));
        break;
    }
    return list;
  }, [history, q, sortBy, statusFilter]);

  const statusChip = (s?: string) => {
    const val = (s ?? '').toLowerCase();
    const map: Record<string, string> = {
      active:   'bg-emerald-50 text-emerald-700 ring-emerald-200',
      resolved: 'bg-gray-100 text-gray-700 ring-gray-200',
      ongoing:  'bg-amber-50 text-amber-700 ring-amber-200',
    };
    const cls = map[val] ?? 'bg-sky-50 text-sky-700 ring-sky-200';
    return <span className={`rounded-full px-2 py-0.5 text-xs ring-1 capitalize ${cls}`}>{s ?? 'unknown'}</span>;
  };

  const severityDot = (sev?: string) => {
    const v = (sev ?? '').toLowerCase();
    const c =
      v === 'severe' ? 'bg-rose-500' :
      v === 'moderate' ? 'bg-amber-500' :
      v === 'mild' ? 'bg-emerald-500' : 'bg-gray-300';
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-600">
        <span className={`h-2 w-2 rounded-full ${c}`} /> {sev ?? '—'}
      </span>
    );
  };

  return (
    <div
      className="p-6"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* Brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-6xl rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)' }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Medical History</h1>
          <p className="mt-1 text-gray-600">
            Manage your medical history, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
          </p>
        </header>

        {/* Alerts */}
        {loading && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800">Loading…</div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
        )}

        {/* Toolbar */}
        <section className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search conditions or notes…"
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="ongoing">Ongoing</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>

              {(q || statusFilter !== 'all' || sortBy !== 'newest') && (
                <button
                  onClick={() => { setQ(''); setStatusFilter('all'); setSortBy('newest'); }}
                  className="h-11 rounded-xl border border-black/10 bg-white px-4 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* List */}
        <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">History</h2>
            <p className="text-xs text-gray-500">Showing {filtered.length} record{filtered.length === 1 ? '' : 's'}</p>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border border-black/5 bg-white/70 p-4">
                  <div className="mb-2 h-4 w-40 animate-pulse rounded bg-gray-200/70" />
                  <div className="h-4 w-72 animate-pulse rounded bg-gray-200/70" />
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-xl border border-black/5 bg-white/70 p-8 text-center text-gray-600">
              No medical history found.
            </div>
          ) : null}

          {!loading && filtered.length > 0 && (
            <ul className="space-y-3">
              {filtered.map((item) => (
                <li key={item.historyId} className="rounded-xl border border-black/5 bg-white p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">{item.conditionName}</h3>
                        {statusChip(item.status)}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">
                        <span className="font-medium">Onset:</span> {formatDate(item.onsetDate)}
                        {item.resolutionDate && (
                          <>
                            {' '}• <span className="font-medium">Resolved:</span> {formatDate(item.resolutionDate)}
                          </>
                        )}
                      </p>
                      {(item.severity || item.notes) && (
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                          {severityDot(item.severity)}
                          {item.notes && (
                            <span className="line-clamp-2 max-w-prose">
                              <span className="font-medium text-gray-600">Notes:</span> {item.notes}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* meta */}
                    <div className="mt-1 flex items-center gap-3 md:mt-0">
                      <span className="rounded-lg bg-[var(--brand)]/30 px-2 py-1 text-xs text-gray-800 ring-1 ring-[var(--brand)]/40">
                        ID: {item.historyId.slice(0, 8)}…
                      </span>
                    </div>
                  </div>

                  {/* attachments (optional) */}
                  {Array.isArray(item.attachments) && item.attachments.length > 0 && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <p className="mb-2 text-xs font-medium text-gray-600">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {item.attachments.map((a, idx) => (
                          <a
                            key={idx}
                            href={a.url || '#'}
                            target={a.url ? '_blank' : undefined}
                            className="inline-flex items-center rounded-lg border border-black/10 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                            onClick={(e) => { if (!a.url) e.preventDefault(); }}
                          >
                            {a.name || `File ${idx + 1}`}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* (Optional) Placeholder for create form — keep backend unchanged */}
        {/* You can wire this later to POST /patient/medical-history */}
        {/* <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
          <h2 className="text-base font-semibold text-gray-900">Add new record</h2>
          <p className="mt-1 text-sm text-gray-600">Coming soon</p>
        </section> */}
      </div>
    </div>
  );
}
