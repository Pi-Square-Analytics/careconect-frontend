/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
//@ts-nocheck
import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Users } from "lucide-react";

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
  const [newUser, setNewUser] = useState<NewUser>({
    email: '',
    phoneNumber: '',
    userType: 'patient',
    firstName: '',
    lastName: '',
    password: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/admin/users');
        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setPagination(response.data.pagination);
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

    fetchUsers();
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

      const response = await api.get('/admin/users');
      if (response.data && response.data.users) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }

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

  const statusColors: Record<User['accountStatus'], string> = {
    active: "bg-green-100 text-green-700 ring-1 ring-green-200",
    inactive: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    pending: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
  };

  if (!user) {
    return <p className="mt-10 text-center text-gray-500">Please log in to view the users page.</p>;
  }

  const BRAND = '#C4E1E1';

  const initials = (f?: string, l?: string) =>
    ((f?.[0] ?? '') + (l?.[0] ?? '') || 'U').toUpperCase();

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
        <header>
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-gray-900">
            <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: 'var(--brand)' }}>
              <Users className="h-5 w-5 text-black/70" />
            </span>
            Users
          </h1>
          <p className="mt-1 text-gray-600">
            Manage system users, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
          </p>
          {pagination?.total && (
            <p className="mt-1 text-xs text-gray-500">Total records: {pagination.total}</p>
          )}
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
            {error}
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

        {/* Users Table */}
        <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-gray-800">User List</CardTitle>
              {pagination?.total && (
                <span className="text-xs text-gray-500">Total: {pagination.total}</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading && !users.length ? (
              <div className="space-y-3 py-6">
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
              </div>
            ) : users.length > 0 ? (
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
                        <TableHead className="text-gray-700">Created</TableHead>
                        <TableHead className="text-gray-700">Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u, idx) => (
                        <TableRow
                          key={u.userId}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                        >
                          <TableCell className="whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-1 ring-black/5">
                                {initials(u.profile.firstName, u.profile.lastName)}
                              </span>
                              <span className="font-medium text-gray-900">
                                {u.profile.firstName} {u.profile.lastName}
                              </span>
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
              <p className="py-6 text-center text-gray-500">No users found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
