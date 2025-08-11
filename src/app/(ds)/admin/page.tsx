'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { get } from '@/lib/api/api';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, CalendarCheck, FileText } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
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

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found. Please log in again.');
        }
        const data = await get<Metrics>('/admin/metrics/overview');
        setMetrics(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching metrics:', err);
        setError(err.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMetrics();
    } else {
      setError('User not authenticated. Please log in.');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-9 w-64 animate-pulse rounded-md bg-gray-200/70" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-black/5 bg-white/70 p-5 shadow-md backdrop-blur">
                <div className="mb-4 h-5 w-24 animate-pulse rounded bg-gray-200/70" />
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200/70" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-80 animate-pulse rounded-xl border border-black/5 bg-white/70 shadow-md backdrop-blur" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="mx-auto mt-12 max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
        role="alert"
      >
        <p className="text-sm font-medium">Error</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <p className="mt-10 text-center text-gray-500">
        Please log in to view the dashboard.
      </p>
    );
  }

  // brand + chart palette
  const BRAND = '#C4E1E1';
  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  const userChartData = metrics
    ? [
        { name: 'Patients', value: Number(metrics.users.patients) },
        { name: 'Doctors', value: Number(metrics.users.doctors) },
        { name: 'Active', value: Number(metrics.users.active) },
        { name: 'Pending Verification', value: Number(metrics.users.pendingVerification) },
        { name: 'Inactive', value: Number(metrics.users.inactive) },
      ]
    : [];

  return (
    <div
      className="p-6"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* header bar + title */}
      <div className="mx-auto max-w-6xl">
        <div
          className="mb-4 h-1 w-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, var(--brand) 22%, var(--brand) 78%, transparent 100%)',
          }}
          aria-hidden
        />
        <header className="mb-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span> 👋
          </p>
        </header>
        {metrics && (
          <p className="text-xs text-gray-500">
            Last generated: {new Date(metrics.generatedAt).toLocaleString()}
          </p>
        )}
      </div>

      {metrics && (
        <div className="mx-auto mt-6 max-w-6xl space-y-6">
          {/* stat cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg ring-1 ring-black/5"
                    style={{ background: 'var(--brand)' }}
                  >
                    <Users className="h-5 w-5 text-black/70" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-800">Users</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">{metrics.users.total}</p>
                <p className="mt-1 text-xs text-gray-500">Total registered</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg ring-1 ring-black/5"
                    style={{ background: 'var(--brand)' }}
                  >
                    <CalendarCheck className="h-5 w-5 text-black/70" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-800">Appointments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">{metrics.appointments.total}</p>
                <p className="mt-1 text-xs text-gray-500">Total booked</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg ring-1 ring-black/5"
                    style={{ background: 'var(--brand)' }}
                  >
                    <FileText className="h-5 w-5 text-black/70" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-800">Invoices</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">{metrics.invoices.total}</p>
                <p className="mt-1 text-xs text-gray-500">Total issued</p>
              </CardContent>
            </Card>
          </div>

          {/* chart card */}
          <div className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">User Distribution</h2>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: 'var(--brand)' }} />
                <span className="text-xs text-gray-500">Live snapshot</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={userChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      label
                    >
                      {userChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* quick stats (derived visually from existing fields, no new logic) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Patients</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.users.patients}</p>
                </div>
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Doctors</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.users.doctors}</p>
                </div>
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.users.active}</p>
                </div>
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.users.pendingVerification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* secondary row (completed/scheduled & invoice breakdown) — uses existing fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-800">Appointments Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.appointments.completed}</p>
                </div>
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Scheduled</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.appointments.scheduled}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-800">Invoice Status</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.invoices.paid}</p>
                </div>
                <div className="rounded-lg border border-black/5 bg-white/70 p-3">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="mt-1 text-lg font-semibold">{metrics.invoices.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
