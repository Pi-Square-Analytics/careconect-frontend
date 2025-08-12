/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import  api  from '@/lib/api/api';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Calendar, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (user) fetchReports();
  }, [user, reportType, filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value, page: '1' }));
    if (name === 'reportType') setReportType(value);
  };

  if (!user) return <p className="text-center text-lg mt-10">Please log in to view the reports page.</p>;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and generate reports, {user.profile.firstName}.
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Filters */}
      <Card className="shadow-lg border-t-4 border-[#C4E1E1]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C4E1E1]" />
            Filter Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Report Type</Label>
            <Select
              value={reportType}
              onValueChange={(v) => handleFilterChange('reportType', v)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(reportEndpoints).map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label>End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {reports.length > 0 ? (
        <Card className="shadow-lg overflow-hidden border-t-4 border-[#C4E1E1]">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#C4E1E1]/20">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report, idx) => (
                  <TableRow
                    key={report.id}
                    className={idx % 2 ? 'bg-gray-50' : ''}
                  >
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <pre className="whitespace-pre-wrap text-xs text-gray-600">
                        {JSON.stringify(report, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          {pagination && (
            <div className="flex justify-between items-center px-4 py-3 bg-gray-100">
              <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages} | Total: {pagination.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev || loading}
                  onClick={() => setFilters({ ...filters, page: (pagination.page - 1).toString() })}
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNext || loading}
                  onClick={() => setFilters({ ...filters, page: (pagination.page + 1).toString() })}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No reports found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
