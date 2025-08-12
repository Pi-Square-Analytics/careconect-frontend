/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
//@ts-nocheck

import { useState, useEffect, useMemo } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  UserPlus,
  Users,
  Search,
  Filter,
  RefreshCcw,
  Download,
  Check,
  X,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

interface User {
  userId: string;
  email: string;
  phoneNumber: string;
  userType: 'patient' | 'admin' | 'doctor';
  accountStatus: 'active' | 'inactive' | 'pending';
  emailVerified: boolean | null;
  phoneVerified: boolean | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  profile: {
    firstName: string;
    lastName: string;
  };
}

interface ApiResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: string;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface NewUser {
  email: string;
  phoneNumber: string;
  userType: 'patient' | 'admin' | 'doctor';
  firstName: string;
  lastName: string;
  password: string;
}

export default function UsersPage() {
  const { user } = useAuthHooks();

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    phoneNumber: '',
    userType: 'patient',
    firstName: '',
    lastName: '',
    password: '',
  });

  // UI state: filters/sort/search
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['userType']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | User['accountStatus']>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'type'>('newest');

  const BRAND = '#C4E1E1';

  const initials = (f?: string, l?: string) =>
    ((f?.[0] ?? '') + (l?.[0] ?? '') || 'U').toUpperCase();

  const statusColors: Record<User['accountStatus'], string> = {
    active: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    inactive: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  };

  const fetchUsers = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/users');
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination(response.data.pagination ?? null);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Unexpected response format from server');
      }
    } catch (err: any) {
      console.error('Fetch users error:', err);
      let errorMessage = 'Failed to fetch users';
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/users', {
        ...newUser,
        profile: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
      await fetchUsers();
      setNewUser({
        email: '',
        phoneNumber: '',
        userType: 'patient',
        firstName: '',
        lastName: '',
        password: '',
      });
    } catch (err: any) {
      console.error('Create user error:', err);
      let errorMessage = 'Failed to create user';
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: keyof NewUser, value: string) => {
    setNewUser({ ...newUser, [name]: value });
  };

  // client-side search/filter/sort
  const filteredUsers = useMemo(() => {
    let list = [...users];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((u) => {
        const full = `${u.profile?.firstName ?? ''} ${u.profile?.lastName ?? ''}`.toLowerCase();
        return (
          full.includes(q) ||
          (u.email ?? '').toLowerCase().includes(q) ||
          (u.phoneNumber ?? '').toLowerCase().includes(q)
        );
      });
    }
    if (roleFilter !== 'all') {
      list = list.filter((u) => u.userType === roleFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter((u) => u.accountStatus === statusFilter);
    }

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case 'oldest':
        list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
      case 'name':
        list.sort((a, b) =>
          `${a.profile.firstName} ${a.profile.lastName}`.localeCompare(
            `${b.profile.firstName} ${b.profile.lastName}`
          )
        );
        break;
      case 'type':
        list.sort((a, b) => a.userType.localeCompare(b.userType));
        break;
    }
    return list;
  }, [users, query, roleFilter, statusFilter, sortBy]);

  const exportCSV = () => {
    const rows = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Type', 'Status', 'Email Verified', 'Phone Verified', 'Created', 'Last Login'],
      ...filteredUsers.map(u => [
        u.profile.firstName,
        u.profile.lastName,
        u.email,
        u.phoneNumber,
        u.userType,
        u.accountStatus,
        u.emailVerified ? 'Yes' : 'No',
        u.phoneVerified ? 'Yes' : 'No',
        new Date(u.createdAt).toISOString(),
        u.lastLogin ? new Date(u.lastLogin).toISOString() : '',
      ]),
    ];
    const csv = rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return <p className="mt-10 text-center text-gray-500">Please log in to view the users page.</p>;
  }

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-4 h-1 max-w-6xl rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)',
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
                <Users className="h-5 w-5 text-black/70" />
              </span>
              Users
            </h1>
            <p className="mt-1 text-gray-600">
              Manage system users, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
            </p>
            {pagination?.total && (
              <p className="mt-1 text-xs text-gray-500">Total records (server): {pagination.total}</p>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={fetchUsers}
              disabled={loading}
              className="rounded-xl bg-[var(--brand)]/70 text-gray-900 hover:bg-[var(--brand)]/90"
              aria-label="Refresh list"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              type="button"
              onClick={exportCSV}
              variant="outline"
              className="rounded-xl border-black/10"
              aria-label="Export CSV"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Create User (collapsible, no extra JS) */}
        <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="pb-0">
            <details open>
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-800">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: 'var(--brand)' }}>
                    <UserPlus className="h-5 w-5 text-black/70" />
                  </span>
                  Create New User
                </CardTitle>
                <span className="text-xs text-gray-500">Click to collapse/expand</span>
              </summary>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </details>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/70 focus-visible:ring-[var(--brand)]"
              />
              <Input
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/70 focus-visible:ring-[var(--brand)]"
              />
              <Input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/70 focus-visible:ring-[var(--brand)]"
              />
              <Input
                placeholder="Phone Number"
                value={newUser.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/70 focus-visible:ring-[var(--brand)]"
              />
              <Select
                value={newUser.userType}
                onValueChange={(val) => handleInputChange("userType", val)}
              >
                <SelectTrigger className="h-11 rounded-xl border-black/10 bg-white/70 focus:ring-[var(--brand)]">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="h-11 rounded-xl border-black/10 bg-white/70 focus-visible:ring-[var(--brand)]"
              />
              <div className="md:col-span-3 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[var(--brand)]/70 text-gray-900 hover:bg-[var(--brand)]/90"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <Card className="rounded-2xl border border-black/5 bg-white/70 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, email, or phone…"
                  className="h-11 w-full rounded-xl border-black/10 pl-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
                    <SelectTrigger className="h-11 w-[150px] rounded-xl border-black/10">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger className="h-11 w-[150px] rounded-xl border-black/10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="h-11 w-[160px] rounded-xl border-black/10">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="name">Name A–Z</SelectItem>
                    <SelectItem value="type">Role A–Z</SelectItem>
                  </SelectContent>
                </Select>

                {(roleFilter !== 'all' || statusFilter !== 'all' || query) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => { setQuery(''); setRoleFilter('all'); setStatusFilter('all'); }}
                    className="h-11 rounded-xl"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-gray-800">User List</CardTitle>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> Showing {filteredUsers.length} users
                </span>
                {pagination?.total && <span>Server total: {pagination.total}</span>}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading && !users.length ? (
              <div className="space-y-3 py-6">
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-black/5">
                <div className="max-h-[60vh] overflow-auto">
                  <Table className="[&_th]:bg-gray-50">
                    <TableHeader className="sticky top-0 z-10 bg-gray-50/70 backdrop-blur">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-gray-700">Name</TableHead>
                        <TableHead className="text-gray-700">Email</TableHead>
                        <TableHead className="text-gray-700">Phone</TableHead>
                        <TableHead className="text-gray-700">Type</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                        <TableHead className="text-gray-700">Verified</TableHead>
                        <TableHead className="text-gray-700">Created</TableHead>
                        <TableHead className="text-gray-700">Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u, idx) => (
                        <TableRow
                          key={u.userId}
                          className={`transition-colors hover:bg-[var(--brand)]/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                        >
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span
                                className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-gray-800 ring-1 ring-black/5"
                                style={{
                                  background:
                                    'radial-gradient(circle at 30% 30%, var(--brand), #ffffff 70%)',
                                }}
                              >
                                {initials(u.profile.firstName, u.profile.lastName)}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {u.profile.firstName} {u.profile.lastName}
                                </span>
                                <span className="text-xs text-gray-500">ID: {u.userId.slice(0, 8)}…</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap">{u.email}</TableCell>
                          <TableCell className="whitespace-nowrap">{u.phoneNumber}</TableCell>
                          <TableCell className="capitalize">{u.userType}</TableCell>

                          <TableCell>
                            <Badge className={`rounded-full px-2 py-0.5 text-xs ${statusColors[u.accountStatus]}`}>
                              {u.accountStatus}
                            </Badge>
                          </TableCell>

                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${u.emailVerified ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
                                {u.emailVerified ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                Email
                              </span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${u.phoneVerified ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
                                {u.phoneVerified ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                Phone
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                          </TableCell>
                        </TableRow>
                      ))}
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
                  <Users className="h-6 w-6 text-black/70" />
                </div>
                <p className="text-sm text-gray-600">No users match your filters.</p>
                <Button
                  variant="ghost"
                  onClick={() => { setQuery(''); setRoleFilter('all'); setStatusFilter('all'); }}
                  className="mt-1 rounded-xl"
                >
                  Reset filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
