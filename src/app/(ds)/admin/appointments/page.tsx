/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { get } from '@/lib/api/api';

interface Appointment {
  appointmentId: string;
  scheduledDate: string;
  reason: string;
  status: string;
  patientName?: string;
  doctorName?: string;
}

interface AppointmentsResponse {
  data: Appointment[];
}

const BRAND = '#C4E1E1';

// Demo data (used if API is empty/unavailable)
const demoAppointments: Appointment[] = [
  {
    appointmentId: 'APT-001',
    scheduledDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    reason: 'General check-up',
    status: 'scheduled',
    patientName: 'Aline Mukamana',
    doctorName: 'Dr. Eric Niyonsaba',
  },
  {
    appointmentId: 'APT-002',
    scheduledDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    reason: 'Follow-up: blood pressure',
    status: 'pending',
    patientName: 'Paul Habimana',
    doctorName: 'Dr. Grace Uwase',
  },
  {
    appointmentId: 'APT-003',
    scheduledDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reason: 'Dermatology consult',
    status: 'completed',
    patientName: 'Eric N.',
    doctorName: 'Dr. A. Mugisha',
  },
  {
    appointmentId: 'APT-004',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    reason: 'Post-op review',
    status: 'cancelled',
    patientName: 'Grace U.',
    doctorName: 'Dr. J. Rwigema',
  },
];

export default function AdminAppointmentsPage() {
  const { user } = useAuthHooks();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'soonest' | 'latest' | 'patient' | 'doctor'>('soonest');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setApiError('User not authenticated. Please log in.');
        return;
      }
      if (user.userType !== 'admin') {
        setApiError('Access denied. Admin privileges required.');
        return;
      }

      setLoading(true);
      setApiError(null);
      setNotice(null);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found. Please log in again.');

        const data = await get<AppointmentsResponse>('/appointments/');
        const list = data?.data ?? [];
        if (Array.isArray(list) && list.length) {
          setAppointments(list);
        } else {
          setAppointments(demoAppointments);
          setNotice('Using demo appointments (API returned no data).');
        }
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
        setAppointments(demoAppointments);
        setNotice('API unavailable. Showing demo appointments.');
        setApiError(err?.message || null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const filtered = useMemo(() => {
    let list = [...appointments];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(a => {
        const base = `${a.appointmentId} ${a.reason} ${a.patientName ?? ''} ${a.doctorName ?? ''}`.toLowerCase();
        return base.includes(q);
      });
    }

    if (statusFilter !== 'all') list = list.filter(a => (a.status || '').toLowerCase() === statusFilter);

    switch (sortBy) {
      case 'soonest':
        list.sort((a, b) => +new Date(a.scheduledDate) - +new Date(b.scheduledDate));
        break;
      case 'latest':
        list.sort((a, b) => +new Date(b.scheduledDate) - +new Date(a.scheduledDate));
        break;
      case 'patient':
        list.sort((a, b) => (a.patientName ?? '').localeCompare(b.patientName ?? ''));
        break;
      case 'doctor':
        list.sort((a, b) => (a.doctorName ?? '').localeCompare(b.doctorName ?? ''));
        break;
    }
    return list;
  }, [appointments, query, statusFilter, sortBy]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const getStatusPill = (status: string) => {
    const s = status?.toLowerCase();
    const map: Record<string, string> = {
      completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      scheduled: 'bg-blue-50 text-blue-700 ring-blue-200',
      cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
      pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    };
    return map[s] || 'bg-gray-50 text-gray-700 ring-gray-200';
  };

  const exportCSV = () => {
    const rows = [
      ['Appointment ID', 'Scheduled Date', 'Reason', 'Status', 'Patient', 'Doctor'],
      ...filtered.map(a => [
        a.appointmentId,
        new Date(a.scheduledDate).toISOString(),
        a.reason,
        a.status,
        a.patientName ?? '',
        a.doctorName ?? '',
      ]),
    ];
    const csv = rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return <p className="mt-10 text-center text-gray-500">Please log in to view the appointments.</p>;
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-1 w-full rounded-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #C4E1E1 22%, #C4E1E1 78%, transparent 100%)' }} />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-gray-200/60" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (apiError && !appointments.length) {
    return (
      <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700" role="alert">
        <p className="text-sm font-medium">Error</p>
        <p className="mt-1 text-sm">{apiError}</p>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div className="mx-auto mb-6 h-1 max-w-6xl rounded-full" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)' }} aria-hidden />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">All Appointments</h1>
            <p className="mt-1 text-gray-600">
              Manage all appointments, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
            </p>
            <p className="mt-2 text-xs text-gray-500">Total appointments: {appointments.length}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </header>

        {/* Alerts */}
        {notice && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
            {notice}
          </div>
        )}
        {apiError && appointments.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
            {apiError}
          </div>
        )}

        {/* Toolbar */}
        <section className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-xl backdrop-blur">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Search</span>
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find by patient, doctor, reason, or ID…"
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-3 pr-3 outline-none ring-0 transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none ring-0 transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none ring-0 transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="soonest">Soonest</option>
                <option value="latest">Latest</option>
                <option value="patient">Patient A–Z</option>
                <option value="doctor">Doctor A–Z</option>
              </select>
            </label>
          </div>
        </section>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white/80 p-12 text-center shadow-xl backdrop-blur">
            <p className="mb-1 text-lg font-medium text-gray-900">No appointments match your filters</p>
            <p className="text-gray-500">Try changing the search or status filter.</p>
          </div>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur">
                  <tr className="[&>th]:px-4 [&>th]:py-3">
                    <th className="text-gray-700">Appointment</th>
                    <th className="text-gray-700">Patient</th>
                    <th className="text-gray-700">Doctor</th>
                    <th className="text-gray-700">Status</th>
                    <th className="text-gray-700">Reason</th>
                    <th className="text-gray-700">ID</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-black/5">
                  {filtered.map((a, idx) => (
                    <tr
                      key={a.appointmentId}
                      className={`transition-colors hover:bg-[var(--brand)]/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {formatDate(a.scheduledDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{a.patientName ?? '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{a.doctorName ?? '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ring-1 ${getStatusPill(a.status || 'pending')}`}>
                          {a.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[320px] truncate" title={a.reason}>
                        {a.reason}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{a.appointmentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
