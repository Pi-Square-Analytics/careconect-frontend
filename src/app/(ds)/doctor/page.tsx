'use client';

import { useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { useDoctorAppointments } from '@/hooks/useAppointments';
// import { Appointment } from '@/types/appointment';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
  Stethoscope,
  CalendarClock,
  Activity,
  Users,
  Search,
  Filter,
  RefreshCcw,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const BRAND = '#C4E1E1';

const statusBadge: Record<string, string> = {
  scheduled: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  completed: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 ring-1 ring-rose-200',
  rescheduled: 'bg-blue-100 text-blue-800 ring-1 ring-blue-200',
};

// Helper to construct Date object from date and time strings
const getDateTime = (dateStr: string, timeStr: string) => {
  return new Date(`${dateStr}T${timeStr}`);
};

export default function DoctorDashboard() {
  const { user } = useAuthHooks();
  const { data: appointments = [], isLoading: loading, error, refetch } = useDoctorAppointments();

  // UI state
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'soonest' | 'latest' | 'patient'>('soonest');

  // derive metrics
  const kpis = useMemo(() => {
    const now = new Date();
    const upcoming = appointments.filter(a => {
      const dt = getDateTime(a.scheduledDate, a.scheduledTime);
      return dt.getTime() >= now.getTime() && a.status === 'scheduled';
    }).length;

    const completedToday = appointments.filter(a => {
      const d = getDateTime(a.scheduledDate, a.scheduledTime);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const apptDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      return (
        a.status === 'completed' &&
        apptDate.getTime() === today.getTime()
      );
    }).length;

    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const uniquePatients = new Set(appointments.map(a => a.patientId)).size;

    return { upcoming, completedToday, cancelled, totalPatients: uniquePatients };
  }, [appointments]);

  // search/filter/sort
  const filtered = useMemo(() => {
    let list = [...appointments];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(a => {
        const pName = a.patient ? `${a.patient.firstName} ${a.patient.lastName}`.toLowerCase() : '';
        return (
          pName.includes(q) ||
          (a.reason ?? '').toLowerCase().includes(q) ||
          (a.appointmentId ?? '').toLowerCase().includes(q)
        );
      });
    }
    if (filterStatus !== 'all') {
      list = list.filter(a => a.status === filterStatus);
    }

    list.sort((a, b) => {
      const dateA = getDateTime(a.scheduledDate, a.scheduledTime).getTime();
      const dateB = getDateTime(b.scheduledDate, b.scheduledTime).getTime();

      switch (sortBy) {
        case 'soonest':
          return dateA - dateB;
        case 'latest':
          return dateB - dateA;
        case 'patient':
          const pA = a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : '';
          const pB = b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : '';
          return pA.localeCompare(pB);
        default:
          return 0;
      }
    });

    return list;
  }, [appointments, filterStatus, query, sortBy]);

  if (!user) return null;

  const initials = (f?: string, l?: string) => ((f?.[0] ?? '') + (l?.[0] ?? '') || 'U').toUpperCase();

  return (
    <div
      className="p-6"
      style={{ '--brand': BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-6xl rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-gray-900">
              <span
                className="grid h-9 w-9 place-items-center rounded-lg ring-1 ring-black/5"
                style={{ background: 'var(--brand)' }}
              >
                <Stethoscope className="h-5 w-5 text-black/70" />
              </span>
              Doctor Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              Welcome, <span className="font-medium">{user.profile?.firstName} {user.profile?.lastName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => refetch()}
              disabled={loading}
              className="rounded-xl bg-[var(--brand)]/70 text-gray-900 hover:bg-[var(--brand)]/90"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarClock className="h-4 w-4" /> Upcoming Today
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-semibold">{kpis.upcoming}</div>
              <p className="mt-1 text-xs text-gray-500">Scheduled and not yet started</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CheckCircle2 className="h-4 w-4" /> Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-semibold">{kpis.completedToday}</div>
              <p className="mt-1 text-xs text-gray-500">Finished appointments</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <XCircle className="h-4 w-4" /> Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-semibold">{kpis.cancelled}</div>
              <p className="mt-1 text-xs text-gray-500">All time in view</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" /> Unique Patients
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-semibold">{kpis.totalPatients}</div>
              <p className="mt-1 text-xs text-gray-500">Across listed appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <Card className="rounded-2xl border border-black/5 bg-white/70 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by patient, reason, or ID…"
                  className="h-11 w-full rounded-xl border-black/10 pl-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
                    <SelectTrigger className="h-11 w-[160px] rounded-xl border-black/10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'soonest' | 'latest' | 'patient')}>
                  <SelectTrigger className="h-11 w-[160px] rounded-xl border-black/10">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soonest">Soonest</SelectItem>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="patient">Patient A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-800">
                <Activity className="h-4 w-4" /> Upcoming Appointments
              </CardTitle>
              <span className="text-xs text-gray-500">
                Showing {filtered.length} of {appointments.length}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-3 py-6">
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
              </div>
            ) : filtered.length ? (
              <div className="overflow-hidden rounded-xl border border-black/5">
                <div className="max-h-[60vh] overflow-auto">
                  <Table className="[&_th]:bg-gray-50">
                    <TableHeader className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-gray-700">Patient</TableHead>
                        <TableHead className="text-gray-700">Date & Time</TableHead>
                        <TableHead className="text-gray-700">Reason</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((a, idx) => {
                        const date = getDateTime(a.scheduledDate, a.scheduledTime);
                        return (
                          <TableRow
                            key={a.appointmentId}
                            className={`transition-colors hover:bg-[var(--brand)]/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                          >
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <span
                                  className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-gray-800 ring-1 ring-black/5"
                                  style={{
                                    background: 'radial-gradient(circle at 30% 30%, var(--brand), #ffffff 70%)',
                                  }}
                                >
                                  {initials(a.patient?.firstName, a.patient?.lastName)}
                                </span>
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">
                                    {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : 'Unknown'}
                                  </span>
                                  {/* Phone number not available in Appointment type per se, unless added */}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-xs text-gray-500">ID: {a.appointmentId}</span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="max-w-[300px] truncate">{a.reason}</TableCell>

                            <TableCell>
                              <Badge className={`rounded-full px-2 py-0.5 text-xs ${statusBadge[a.status] || 'bg-gray-100'}`}>
                                {a.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl ring-1 ring-black/5"
                  style={{ background: 'var(--brand)' }}
                >
                  <Clock className="h-6 w-6 text-black/70" />
                </div>
                <p className="text-sm text-gray-600">No appointments match your filters.</p>
                <Button
                  variant="ghost"
                  onClick={() => { setQuery(''); setFilterStatus('all'); setSortBy('soonest'); }}
                  className="mt-1 rounded-xl"
                >
                  Reset filters
                </Button>
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm text-rose-600">
                {error instanceof Error ? error.message : String(error)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500">
          Tip: Use the search and status filter to quickly triage your day.
        </p>
      </div>
    </div>
  );
}
