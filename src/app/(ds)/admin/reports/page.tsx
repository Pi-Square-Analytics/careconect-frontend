'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

interface Report {
  id: string;
  type: string;
  createdAt: string;
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  data: Report[];
  pagination: {
    page: number;
    limit: number;
    total: string;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface Filters {
  startDate: string;
  endDate: string;
  groupBy?: string;
  page: string;
}

export default function ReportsPage() {
  const { user } = useAuthHooks();
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>('appointments');
  const [filters, setFilters] = useState<Filters>({
    startDate: '2024-01-01',
    endDate: new Date().toISOString().split('T')[0],
    groupBy: 'month',
    page: '1',
  });

  const reportEndpoints: Record<string, string> = {
    activityLogs: '/reports/admin/activity/logs',
    appointments: '/reports/admin/reports/appointments',
    invoices: '/reports/admin/reports/invoices',
    financial: '/reports/admin/reports/financial',
    clinical: '/reports/admin/reports/clinical',
    userActivity: '/reports/admin/reports/user-activity',
    systemPerformance: '/reports/admin/reports/system-performance',
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          startDate: filters.startDate,
          endDate: filters.endDate,
          ...(filters.groupBy && { groupBy: filters.groupBy }),
          page: filters.page || '1',
          limit: '50',
        }).toString();
        const endpoint = reportEndpoints[reportType] || reportEndpoints.appointments;
        const response = await api.get<ApiResponse>(`${endpoint}?${query}`);
        setReports(Array.isArray(response.data.data) ? response.data.data : []);
        setPagination(response.data.pagination || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch reports');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchReports();
    }
  }, [user, reportType, filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: '1',
    }));
    if (name === 'reportType') {
      setReportType(value);
    }
  };

  const handleGenerateCustomReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/reports/admin/reports/custom/generate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
        reportType,
      });
      const response = await api.get<ApiResponse>(
        `${reportEndpoints[reportType]}?startDate=${filters.startDate}&endDate=${filters.endDate}`
      );
      setReports(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to generate custom report');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p>Please log in to view the reports page.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="text-muted-foreground">
        View reports, {user.profile.firstName} {user.profile.lastName}.
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(v) => handleFilterChange('reportType', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activityLogs">Activity Logs</SelectItem>
                  <SelectItem value="appointments">Appointments</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="userActivity">User Activity</SelectItem>
                  <SelectItem value="systemPerformance">System Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleGenerateCustomReport}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label>Report Type</Label>
              <Select
                value={reportType}
                onValueChange={(v) => handleFilterChange('reportType', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointments">Appointments</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="clinical">Clinical</SelectItem>
                  <SelectItem value="userActivity">User Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {reports.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(report, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pagination && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm">
                  Page {pagination.page} of {pagination.pages} | Total: {pagination.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev || loading}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        page: (pagination.page - 1).toString(),
                      })
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext || loading}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        page: (pagination.page + 1).toString(),
                      })
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
}
