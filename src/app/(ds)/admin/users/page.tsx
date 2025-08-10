'use client';
//@ts-nocheck
import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';
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
      setLoading(true);
      try {
        const response = await api.get<ApiResponse>('/admin/users');
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchUsers();
    }
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
      const response = await api.get<ApiResponse>('/admin/users');
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setNewUser({
        email: '',
        phoneNumber: '',
        userType: 'patient',
        firstName: '',
        lastName: '',
        password: '',
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: keyof NewUser, value: string) => {
    setNewUser({ ...newUser, [name]: value });
  };

  const statusColors: Record<User['accountStatus'], string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  if (!user) {
    return <p className="text-center text-gray-500 mt-10">Please log in to view the users page.</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" /> Users
        </h1>
        <p className="text-gray-500">
          Manage system users, {user.profile.firstName} {user.profile.lastName}.
        </p>
      </header>

      {error && <p className="text-red-500">{error}</p>}

      {/* Create User Form */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" /> Create New User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="First Name" value={newUser.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
            <Input placeholder="Last Name" value={newUser.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
            <Input placeholder="Email" type="email" value={newUser.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
            <Input placeholder="Phone Number" value={newUser.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} required />
            <Select value={newUser.userType} onValueChange={(val) => handleInputChange("userType", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Password" type="password" value={newUser.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.userId}>
                    <TableCell>{u.profile.firstName} {u.profile.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phoneNumber}</TableCell>
                    <TableCell className="capitalize">{u.userType}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[u.accountStatus]}>
                        {u.accountStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-6">No users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
