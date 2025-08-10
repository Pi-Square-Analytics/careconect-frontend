// app/admin/audit-logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

interface Log {
  id: string;
  action: string;
  timestamp: string;
  userId?: string;
  [key: string]: any; // Allow dynamic fields
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

export default function AuditLogsPage() {
  const { user } = useAuthHooks();
  const [logs, setLogs] = useState<Log[]>([]);
  const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    startDate: '2024-01-01',
    endDate: new Date().toISOString().split('T')[0], // Current date
    page: '1',
  });

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: filters.page || '1',
          limit: '10',
        }).toString();
        const response = await api.get<ApiResponse>(`/reports/admin/activity/logs?${query}`);
        console.log('API Response:', response.data); // Debug log
        const fetchedLogs = response.data.data?.logs || [];
        setLogs(Array.isArray(fetchedLogs) ? fetchedLogs : []);
        setPagination(response.data.data?.pagination || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch audit logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchLogs();
    }
  }, [user, filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: '1' });
  };

  if (!user) {
    return <p>Please log in to view the audit logs page.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <p className="mb-4">
        View audit logs, {user.profile.firstName} {user.profile.lastName}.
      </p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Filter Audit Logs</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
        </form>
      </div>

      {/* Logs List */}
      {logs && logs.length > 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Audit Logs</h2>
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="border p-2 rounded">
                <p>
                  <strong>Action:</strong> {log.action}
                </p>
                <p>
                  <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
                </p>
                {log.userId && (
                  <p>
                    <strong>User ID:</strong> {log.userId}
                  </p>
                )}
                {/* Display additional fields dynamically */}
                {Object.entries(log).map(([key, value]) => (
                  key !== 'id' && key !== 'action' && key !== 'timestamp' && key !== 'userId' && (
                    <p key={key}>
                      <strong>{key}:</strong> {JSON.stringify(value)}
                    </p>
                  )
                ))}
              </li>
            ))}
          </ul>
          {pagination && (
            <div className="mt-4">
              <p>
                Page {pagination.page} of {Math.ceil(pagination.count / pagination.limit)} | Total Logs: {pagination.count}
              </p>
              <div className="flex space-x-2">
                <button
                  disabled={pagination.page <= 1 || loading}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: (pagination.page - 1).toString(),
                    })
                  }
                  className="bg-gray-200 p-2 rounded disabled:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= Math.ceil(pagination.count / pagination.limit) || loading}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: (pagination.page + 1).toString(),
                    })
                  }
                  className="bg-gray-200 p-2 rounded disabled:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No audit logs found.</p>
      )}
    </div>
  );
}