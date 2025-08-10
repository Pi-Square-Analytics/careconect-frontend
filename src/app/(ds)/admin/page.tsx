'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';
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
        const response = await api.get('/admin/metrics/overview');
        setMetrics(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  if (!user) {
    return <p className="text-center text-gray-500 mt-10">Please log in to view the dashboard.</p>;
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

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
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-semibold">{user.profile.firstName} {user.profile.lastName}</span> 👋
        </p>
      </header>

      {loading && <p className="text-center text-gray-400">Loading data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {metrics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-md border-l-4 border-indigo-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-indigo-600">Users</CardTitle>
                <Users className="h-6 w-6 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{metrics.users.total}</p>
                <p className="text-sm text-gray-500">Total registered</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-l-4 border-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-green-600">Appointments</CardTitle>
                <CalendarCheck className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{metrics.appointments.total}</p>
                <p className="text-sm text-gray-500">Total booked</p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-l-4 border-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-yellow-600">Invoices</CardTitle>
                <FileText className="h-6 w-6 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{metrics.invoices.total}</p>
                <p className="text-sm text-gray-500">Total issued</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
            <h2 className="text-xl font-bold mb-4">User Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {userChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
