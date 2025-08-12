/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import  api  from '@/lib/api/api';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { FileText, Filter, Search, RefreshCcw, Download, CalendarDays, ListTree } from 'lucide-react';

interface Log {
  id: string;
  action: string;
  timestamp: string;
  userId?: string;
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  data: {
    logs: Log[];
    pagination: {
      page: number;
      limit: number;
      count: number;
    };
  };
}

interface Filters {
  startDate: string;
  endDate: string;
  page: string;
}

const BRAND = '#C4E1E1';

// Dummy data (used when API isn't ready)
const demoLogs: Log[] = [
  {
    id: 'log_001',
    action: 'USER_LOGIN',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    userId: 'u_12345',
    ip: '192.168.0.10',
    method: 'POST',
    path: '/auth/login',
    status: 200,
  },
  {
    id: 'log_002',
    action: 'USER_UPDATE_PROFILE',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    userId: 'u_12345',
    changes: { phoneNumber: '****6789' },
  },
  {
    id: 'log_003',
    action: 'ADMIN_CREATE_USER',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    userId: 'admin_007',
    targetUserId: 'u_88888',
    role: 'doctor',
  },
  {
    id: 'log_004',
    action: 'SYSTEM_MAINTENANCE_TOGGLE',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    userId: 'admin_007',
    systemMaintenance: true,
  },
];

export default function AuditLogsPage() {
  const { user } = useAuthHooks();

  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    startDate: '2024-01-01',
    endDate: new Date().toISOString().split('T')[0],
    page: '1',
  });

  // UI-only helpers
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | string>('all');
  const [notice, setNotice] = useState<string | null>(null);

  // Fetch logs (with graceful demo fallback)
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      setNotice(null);
      try {
        const queryParams = new URLSearchParams({
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page || '1',
          limit: '10',
        }).toString();

        const response = await api.get<ApiResponse>(`/reports/admin/activity/logs?${queryParams}`);
        const fetchedLogs = response.data?.data?.logs ?? [];
        const pg = response.data?.data?.pagination ?? { page: Number(filters.page || '1'), limit: 10, count: fetchedLogs.length };

        if (Array.isArray(fetchedLogs) && fetchedLogs.length) {
          setLogs(fetchedLogs);
          setPagination(pg);
        } else {
          // No data yet: use demo
          setLogs(demoLogs);
          setPagination({ page: 1, limit: 10, count: demoLogs.length });
          //setNotice('Using demo logs (API returned no data).');
        }
      } catch (err: any) {
        // API unavailable: demo mode
        setLogs(demoLogs);
        setPagination({ page: 1, limit: 10, count: demoLogs.length });
        //setNotice('these data need more processing');
        setError(err?.response?.data?.message || null);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user, filters]);

  const allActions = useMemo(() => {
    const set = new Set<string>();
    (logs || []).forEach(l => l?.action && set.add(l.action));
    return Array.from(set).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    let list = [...logs];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter(l => {
        const base = `${l.id} ${l.action} ${l.userId ?? ''}`.toLowerCase();
        const extra = Object.entries(l)
          .filter(([k]) => !['id', 'action', 'timestamp', 'userId'].includes(k))
          .map(([, v]) => JSON.stringify(v))
          .join(' ')
          .toLowerCase();
        return base.includes(q) || extra.includes(q);
      });
    }

    if (actionFilter !== 'all') {
      list = list.filter(l => l.action === actionFilter);
    }

    // Keep newest first
    list.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
    return list;
  }, [logs, query, actionFilter]);

  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.max(1, Math.ceil(pagination.count / pagination.limit));
  }, [pagination]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: '1' });
  };

  const goPage = (p: number) => {
    if (!pagination) return;
    const safe = Math.min(Math.max(1, p), totalPages);
    setFilters({ ...filters, page: String(safe) });
  };

  const exportCSV = () => {
    const rows = [
      ['ID', 'Action', 'Timestamp', 'User ID', 'Extras(JSON)'],
      ...filteredLogs.map(l => [
        l.id,
        l.action,
        new Date(l.timestamp).toISOString(),
        l.userId ?? '',
        JSON.stringify(
          Object.fromEntries(Object.entries(l).filter(([k]) => !['id', 'action', 'timestamp', 'userId'].includes(k)))
        ),
      ]),
    ];
    const csv = rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return <p className="p-6 text-gray-500">Please log in to view the audit logs page.</p>;
  }

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-6xl rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)' }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-gray-900">
              <span className="grid h-9 w-9 place-items-center rounded-lg ring-1 ring-black/5" style={{ background: 'var(--brand)' }}>
                <FileText className="h-5 w-5 text-black/70" />
              </span>
              Audit Logs
            </h1>
            <p className="mt-1 text-gray-600">
              View audit logs, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setFilters({ ...filters })} // triggers refetch; keeps same filters
              className="rounded-xl bg-[var(--brand)]/80 text-gray-900 hover:bg-[var(--brand)]"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={exportCSV}
              className="rounded-xl border-black/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </header>

        {/* Alerts */}
        {(loading || notice || error) && (
          <div className="space-y-3">
            {loading && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700" role="status">
                Loading logs…
              </div>
            )}
            {notice && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
                {notice}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Filters toolbar */}
        <Card className="rounded-2xl border border-black/5 bg-white/70 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-gray-700">Start date</span>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="date"
                      name="startDate"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      className="h-11 rounded-xl pl-9"
                      required
                    />
                  </div>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium text-gray-700">End date</span>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="date"
                      name="endDate"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      className="h-11 rounded-xl pl-9"
                      required
                    />
                  </div>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium text-gray-700">Search</span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Find by action, user, id, or JSON…"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        // reset page for client view
                        setFilters({ ...filters, page: '1' });
                      }}
                      className="h-11 rounded-xl pl-9"
                    />
                  </div>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium text-gray-700">Action</span>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setFilters({ ...filters, page: '1' }); }}>
                      <SelectTrigger className="h-11 w-full rounded-xl">
                        <SelectValue placeholder="All actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All actions</SelectItem>
                        {allActions.map(a => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => { setQuery(''); setActionFilter('all'); setFilters({ ...filters, page: '1' }); }}
                  className="rounded-xl"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs table */}
        <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                <ListTree className="h-4 w-4" /> Audit Logs
              </CardTitle>
              {pagination && (
                <div className="text-xs text-gray-500">
                  Page {pagination.page} of {totalPages} • Total: {pagination.count}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {loading && !logs.length ? (
              <div className="space-y-3 py-6">
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
              </div>
            ) : filteredLogs.length ? (
              <div className="overflow-hidden rounded-xl border border-black/5">
                <div className="max-h-[60vh] overflow-auto">
                  <Table className="[&_th]:bg-gray-50">
                    <TableHeader className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-gray-700">Action</TableHead>
                        <TableHead className="text-gray-700">Timestamp</TableHead>
                        <TableHead className="text-gray-700">User</TableHead>
                        <TableHead className="text-gray-700">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log, idx) => {
                        const extraEntries = Object.entries(log).filter(
                          ([k]) => !['id', 'action', 'timestamp', 'userId'].includes(k)
                        );
                        return (
                          <TableRow
                            key={log.id}
                            className={`transition-colors hover:bg-[var(--brand)]/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                          >
                            <TableCell className="whitespace-nowrap font-medium">{log.action}</TableCell>
                            <TableCell className="whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              {log.userId ? <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs ring-1 ring-black/5"> {log.userId} </span> : '—'}
                            </TableCell>
                            <TableCell>
                              {extraEntries.length ? (
                                <div className="grid gap-1">
                                  {extraEntries.slice(0, 3).map(([k, v]) => (
                                    <div key={k} className="text-xs text-gray-700">
                                      <span className="font-medium">{k}:</span> <span className="break-all">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                    </div>
                                  ))}
                                  {extraEntries.length > 3 && (
                                    <details className="text-xs text-gray-600">
                                      <summary className="cursor-pointer select-none underline">More</summary>
                                      <pre className="mt-1 overflow-auto rounded bg-gray-50 p-2 ring-1 ring-black/5">
                                        {JSON.stringify(Object.fromEntries(extraEntries), null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No extra fields</span>
                              )}
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
                  <FileText className="h-6 w-6 text-black/70" />
                </div>
                <p className="text-sm text-gray-600">No audit logs match your filters.</p>
                <Button
                  variant="ghost"
                  onClick={() => { setQuery(''); setActionFilter('all'); setFilters({ ...filters, page: '1' }); }}
                  className="mt-1 rounded-xl"
                >
                  Reset filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination && filteredLogs.length > 0 && (
              <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div className="text-xs text-gray-500">
                  Showing page {pagination.page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-black/10"
                    disabled={pagination.page <= 1 || loading}
                    onClick={() => goPage(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-black/10"
                    disabled={pagination.page >= totalPages || loading}
                    onClick={() => goPage(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
