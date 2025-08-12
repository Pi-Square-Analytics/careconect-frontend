/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
//@ts-nocheck

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { get } from '@/lib/api/api';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Users, CalendarCheck, FileText, RefreshCcw, Download } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
} from 'recharts';

interface Metrics {
  users: {
    total: string;
    patients: string;
    doctors: string;
    active: string;
    pendingVerification: string;
    inactive: number;
  };
  appointments: {
    total: string;
    completed: string;
    scheduled: string;
  };
  invoices: {
    total: string;
    paid: string;
    pending: string;
  };
  generatedAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuthHooks();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) { setError('User not authenticated. Please log in.'); return; }
      setLoading(true);
      setError(null);
      setNotice(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found. Please log in again.');
        const data = await get<Metrics>('/admin/metrics/overview');
        setMetrics(data);
      } catch (err: any) {
        console.error('Error fetching metrics:', err);
        setError(err?.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [user]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await get<Metrics>('/admin/metrics/overview');
      setMetrics(data);
      setNotice('Dashboard refreshed.');
      setTimeout(() => setNotice(null), 1800);
    } catch (e) {
      setError('Failed to refresh.');
      console.log(e)
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!metrics) return;
    const rows = [
      ['Section','Key','Value'],
      ['Users','total', metrics.users.total],
      ['Users','patients', metrics.users.patients],
      ['Users','doctors', metrics.users.doctors],
      ['Users','active', metrics.users.active],
      ['Users','pendingVerification', metrics.users.pendingVerification],
      ['Users','inactive', String(metrics.users.inactive)],
      ['Appointments','total', metrics.appointments.total],
      ['Appointments','completed', metrics.appointments.completed],
      ['Appointments','scheduled', metrics.appointments.scheduled],
      ['Invoices','total', metrics.invoices.total],
      ['Invoices','paid', metrics.invoices.paid],
      ['Invoices','pending', metrics.invoices.pending],
      ['Meta','generatedAt', metrics.generatedAt],
    ];
    const csv = rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `admin-metrics-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return <p className="mt-10 text-center text-gray-500">Please log in to view the dashboard.</p>;
  }

  // brand + chart palette
  const BRAND = '#C4E1E1';
  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const userChartData = useMemo(() => (
    metrics ? [
      { name: 'Patients', value: Number(metrics.users.patients) },
      { name: 'Doctors', value: Number(metrics.users.doctors) },
      { name: 'Active', value: Number(metrics.users.active) },
      { name: 'Pending', value: Number(metrics.users.pendingVerification) },
      { name: 'Inactive', value: Number(metrics.users.inactive) },
    ] : []
  ), [metrics]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-1 w-full rounded-full" style={{ background:'linear-gradient(90deg, transparent 0%, #C4E1E1 22%, #C4E1E1 78%, transparent 100%)' }} />
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200/70" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-white/70 p-5 shadow-xl backdrop-blur">
                <div className="mb-3 h-5 w-28 animate-pulse rounded bg-gray-200/60" />
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200/60" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-80 animate-pulse rounded-2xl border border-black/5 bg-white/70 shadow-xl backdrop-blur" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700" role="alert">
        <p className="text-sm font-medium">Error</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-6xl rounded-full"
        style={{ background:'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)' }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header + actions */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Welcome back, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
            </p>
            {metrics && (
              <p className="mt-1 text-xs text-gray-500">Last generated: {new Date(metrics.generatedAt).toLocaleString()}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refresh} disabled={loading} className="rounded-xl bg-[var(--brand)]/80 text-gray-900 hover:bg-[var(--brand)] disabled:opacity-60">
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" onClick={exportCSV} className="rounded-xl border-black/10">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </header>

        {notice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
            {notice}
          </div>
        )}

        {metrics && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard
                icon={<Users className="h-5 w-5 text-black/70" />}
                title="Users"
                value={metrics.users.total}
                brand
              />
              <StatCard
                icon={<CalendarCheck className="h-5 w-5 text-black/70" />}
                title="Appointments"
                value={metrics.appointments.total}
              />
              <StatCard
                icon={<FileText className="h-5 w-5 text-black/70" />}
                title="Invoices"
                value={metrics.invoices.total}
              />
            </div>

            {/* Donut chart + quick stats */}
            <div className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">User Distribution</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--brand)' }} />
                  <span className="text-xs text-gray-500">Snapshot</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={userChartData}
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {userChartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Mini stat="Patients" value={metrics.users.patients} />
                  <Mini stat="Doctors" value={metrics.users.doctors} />
                  <Mini stat="Active" value={metrics.users.active} />
                  <Mini stat="Pending" value={metrics.users.pendingVerification} />
                </div>
              </div>
            </div>

            {/* Secondary row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">Appointments Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Mini stat="Completed" value={metrics.appointments.completed} />
                  <Mini stat="Scheduled" value={metrics.appointments.scheduled} />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">Invoice Status</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Mini stat="Paid" value={metrics.invoices.paid} />
                  <Mini stat="Pending" value={metrics.invoices.pending} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- tiny UI atoms (no logic changes) ---------- */

function StatCard({ icon, title, value, brand = false }: { icon: React.ReactNode; title: string; value: string | number; brand?: boolean }) {
  return (
    <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 place-items-center rounded-lg ring-1 ring-black/5"
            style={{ background: brand ? 'var(--brand)' : 'rgba(0,0,0,0.04)' }}
          >
            {icon}
          </div>
          <CardTitle className="text-sm font-medium text-gray-800">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-gray-500">Total</p>
      </CardContent>
    </Card>
  );
}

function Mini({ stat, value }: { stat: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white/70 p-3">
      <p className="text-xs text-gray-500">{stat}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
