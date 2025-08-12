/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/doctors/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api';

interface Doctor {
  doctorId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  medicalLicenseNumber: string;
  specialty: string;
  consultationFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    phoneNumber: string;
    profile: { firstName: string; lastName: string };
  };
}

interface NewDoctor {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  medicalLicenseNumber: string;
  specialty: string;
  consultationFee: number;
  isActive: boolean;
}

interface UpdateDoctor {
  medicalLicenseNumber?: string;
  specialty?: string;
  consultationFee?: number;
  isActive?: boolean;
}

interface UpdateStatus {
  isActive: boolean;
  reason?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: string;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function DoctorsPage() {
  const { user } = useAuthHooks();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // forms
  const [newDoctor, setNewDoctor] = useState<NewDoctor>({
    email: '',
    phoneNumber: '',
    password: '',
    firstName: '',
    lastName: '',
    medicalLicenseNumber: '',
    specialty: '',
    consultationFee: 0,
    isActive: true,
  });
  const [updateDoctor, setUpdateDoctor] = useState<UpdateDoctor>({});
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({ isActive: true });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // filters/sort/search
  const [filters, setFilters] = useState({ specialty: '', isActive: '', page: '1' });
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'specialty' | 'feeAsc' | 'feeDesc' | 'newest'>('newest');

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        if (filters.specialty) qs.append('specialty', filters.specialty);
        if (filters.isActive) qs.append('isActive', filters.isActive);
        if (filters.page) qs.append('page', filters.page);

        const url = `/doctors/${qs.toString() ? `?${qs.toString()}` : ''}`;
        const response = await api.get(url);

        let fetchedDoctors: Doctor[] = [];
        let fetchedPagination: Pagination | null = null;
        if (response.data) {
          if (response.data.data) {
            fetchedDoctors = response.data.data.doctors || response.data.data || [];
            fetchedPagination = response.data.data.pagination || null;
          } else if (response.data.doctors) {
            fetchedDoctors = response.data.doctors;
            fetchedPagination = response.data.pagination || null;
          } else if (Array.isArray(response.data)) {
            fetchedDoctors = response.data;
          } else if (response.data.doctorId) {
            fetchedDoctors = [response.data];
          }
        }

        setDoctors(Array.isArray(fetchedDoctors) ? fetchedDoctors : []);
        setPagination(fetchedPagination);
      } catch (err: any) {
        let msg = 'Failed to fetch doctors';
        if (typeof err === 'string') msg = err;
        else if (err?.response?.data?.message) msg = err.response.data.message;
        else if (err?.message) msg = err.message;
        setError(msg);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [user, filters]);

  const refetchDoctors = async () => {
    try {
      const response = await api.get('/doctors/');
      let fetchedDoctors: Doctor[] = [];
      let fetchedPagination: Pagination | null = null;

      if (response.data) {
        if (response.data.data) {
          fetchedDoctors = response.data.data.doctors || response.data.data || [];
          fetchedPagination = response.data.data.pagination || null;
        } else if (response.data.doctors) {
          fetchedDoctors = response.data.doctors;
          fetchedPagination = response.data.pagination || null;
        } else if (Array.isArray(response.data)) {
          fetchedDoctors = response.data;
        }
      }

      setDoctors(Array.isArray(fetchedDoctors) ? fetchedDoctors : []);
      setPagination(fetchedPagination);
    } catch {
      /* silent */
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/doctors/', newDoctor);
      await refetchDoctors();
      setNewDoctor({
        email: '',
        phoneNumber: '',
        password: '',
        firstName: '',
        lastName: '',
        medicalLicenseNumber: '',
        specialty: '',
        consultationFee: 0,
        isActive: true,
      });
    } catch (err: any) {
      let msg = 'Failed to create doctor';
      if (typeof err === 'string') msg = err;
      else if (err?.response?.data?.message) msg = err.response.data.message;
      else if (err?.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctor = async (doctorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/doctors/${doctorId}`, updateDoctor);
      await refetchDoctors();
      setSelectedDoctorId(null);
      setUpdateDoctor({});
    } catch (err: any) {
      let msg = 'Failed to update doctor';
      if (typeof err === 'string') msg = err;
      else if (err?.response?.data?.message) msg = err.response.data.message;
      else if (err?.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (doctorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/doctors/${doctorId}/status`, updateStatus);
      await refetchDoctors();
      setSelectedDoctorId(null);
      setUpdateStatus({ isActive: true });
    } catch (err: any) {
      let msg = 'Failed to update status';
      if (typeof err === 'string') msg = err;
      else if (err?.response?.data?.message) msg = err.response.data.message;
      else if (err?.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/doctors/${doctorId}`);
      await refetchDoctors();
    } catch (err: any) {
      let msg = 'Failed to delete doctor';
      if (typeof err === 'string') msg = err;
      else if (err?.response?.data?.message) msg = err.response.data.message;
      else if (err?.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<any>>,
    state: any
  ) => {
    const { name, value } = e.target;
    let processed: any = value;
    if (name === 'isActive') processed = value === 'true';
    else if (name === 'consultationFee') processed = parseFloat(value) || 0;
    setState({ ...state, [name]: processed });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage.toString() });
  };

  const getDoctorName = (d: Doctor) =>
    d.user?.profile ? `${d.user.profile.firstName} ${d.user.profile.lastName}` : `${d.firstName} ${d.lastName}`;
  const getDoctorEmail = (d: Doctor) => d.user?.email || d.email;
  const getDoctorPhone = (d: Doctor) => d.user?.phoneNumber || d.phoneNumber;

  // client-side search/sort
  const visibleDoctors = useMemo(() => {
    let list = [...doctors];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(d => {
        const base = `${getDoctorName(d)} ${d.specialty} ${d.medicalLicenseNumber} ${getDoctorEmail(d)} ${getDoctorPhone(d)}`.toLowerCase();
        return base.includes(q);
      });
    }

    switch (sortBy) {
      case 'name':
        list.sort((a, b) => getDoctorName(a).localeCompare(getDoctorName(b)));
        break;
      case 'specialty':
        list.sort((a, b) => (a.specialty || '').localeCompare(b.specialty || ''));
        break;
      case 'feeAsc':
        list.sort((a, b) => (a.consultationFee || 0) - (b.consultationFee || 0));
        break;
      case 'feeDesc':
        list.sort((a, b) => (b.consultationFee || 0) - (a.consultationFee || 0));
        break;
      case 'newest':
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
    }
    return list;
  }, [doctors, query, sortBy]);

  const exportCSV = () => {
    const rows = [
      ['Doctor ID', 'Name', 'Email', 'Phone', 'License', 'Specialty', 'Fee', 'Active', 'Created'],
      ...visibleDoctors.map(d => [
        d.doctorId,
        getDoctorName(d),
        getDoctorEmail(d),
        getDoctorPhone(d),
        d.medicalLicenseNumber,
        d.specialty,
        d.consultationFee,
        d.isActive ? 'true' : 'false',
        new Date(d.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctors-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return <p className="mt-10 text-center text-gray-500">Please log in to view the doctors page.</p>;
  }

  const BRAND = '#C4E1E1';
  const initials = (f?: string, l?: string) => ((f?.[0] ?? '') + (l?.[0] ?? '') || 'D').toUpperCase();

  return (
    <div className="p-6" style={{ ['--brand' as any]: BRAND } as React.CSSProperties}>
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
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Doctors</h1>
            <p className="mt-1 text-gray-600">
              Manage doctors, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
            </p>
            {pagination?.total && (
              <p className="mt-2 text-xs text-gray-500">Total doctors: {pagination.total}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
            >
              Export CSV
            </button>
          </div>
        </header>

        {loading && (
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700" role="alert">
            {error}
          </div>
        )}

        {/* Toolbar */}
        <section className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-xl backdrop-blur">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, license, email, phone…"
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Filter by Specialty</span>
              <input
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                placeholder="e.g., Cardiology"
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="newest">Newest</option>
                <option value="name">Name A–Z</option>
                <option value="specialty">Specialty A–Z</option>
                <option value="feeAsc">Fee ↑</option>
                <option value="feeDesc">Fee ↓</option>
              </select>
            </label>
          </div>
        </section>

        {/* Create Doctor */}
        <section className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <details open className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
              <span className="text-base font-medium text-gray-800">Create New Doctor</span>
              <span className="text-xs text-gray-500 group-open:opacity-60">Collapse/Expand</span>
            </summary>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            <div className="p-5">
              <form onSubmit={handleCreateDoctor} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { label: 'First Name', name: 'firstName', type: 'text' },
                  { label: 'Last Name', name: 'lastName', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
                  { label: 'Password', name: 'password', type: 'password' },
                  { label: 'Medical License Number', name: 'medicalLicenseNumber', type: 'text' },
                  { label: 'Specialty', name: 'specialty', type: 'text' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={(newDoctor as any)[f.name]}
                      onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                      className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={newDoctor.consultationFee}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Active Status</label>
                  <select
                    name="isActive"
                    value={newDoctor.isActive.toString()}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-xl bg-[var(--brand)]/80 px-4 py-2.5 font-medium text-gray-900 ring-1 ring-[var(--brand)]/60 transition hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Creating…' : 'Create Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </details>
        </section>

        {/* Table */}
        {visibleDoctors.length > 0 ? (
          <section className="overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
            <div className="max-h-[65vh] overflow-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur">
                  <tr className="[&>th]:px-4 [&>th]:py-3">
                    <th className="text-gray-700">Doctor</th>
                    <th className="text-gray-700">Specialty</th>
                    <th className="text-gray-700">Contact</th>
                    <th className="text-gray-700">License</th>
                    <th className="text-gray-700">Fee</th>
                    <th className="text-gray-700">Status</th>
                    <th className="text-gray-700">Created</th>
                    <th className="text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-black/5">
                  {visibleDoctors.map((d, idx) => (
                    <tr
                      key={d.doctorId}
                      className={`transition-colors hover:bg-[var(--brand)]/10 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-1 ring-black/5">
                            {initials(
                              d.user?.profile?.firstName ?? d.firstName,
                              d.user?.profile?.lastName ?? d.lastName
                            )}
                          </span>
                          <div>
                            <div className="font-medium text-gray-900">{getDoctorName(d)}</div>
                            <div className="text-xs text-gray-500">{d.doctorId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{d.specialty}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{getDoctorEmail(d)}</div>
                        <div className="text-xs text-gray-500">{getDoctorPhone(d)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">#{d.medicalLicenseNumber}</td>
                      <td className="px-4 py-3 whitespace-nowrap">${d.consultationFee}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${d.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-rose-200'}`}>
                          {d.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedDoctorId(d.doctorId)}
                            className="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-900 ring-1 ring-yellow-200 hover:bg-yellow-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(d.doctorId)}
                            className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-900 ring-1 ring-rose-200 hover:bg-rose-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* inline editor */}
            {selectedDoctorId && (
              <div className="border-t border-black/5 p-5">
                {(() => {
                  const d = doctors.find(x => x.doctorId === selectedDoctorId)!;
                  return (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl border border-black/5 bg-white p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Update Doctor</h3>
                        <form
                          onSubmit={(e) => { e.preventDefault(); handleUpdateDoctor(d.doctorId); }}
                          className="grid grid-cols-1 gap-4"
                        >
                          <label className="grid gap-1">
                            <span className="text-sm font-medium text-gray-700">Medical License Number</span>
                            <input
                              type="text"
                              name="medicalLicenseNumber"
                              value={updateDoctor.medicalLicenseNumber ?? d.medicalLicenseNumber}
                              onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                              className="h-11 rounded-xl border border-black/10 bg-white px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-sm font-medium text-gray-700">Specialty</span>
                            <input
                              type="text"
                              name="specialty"
                              value={updateDoctor.specialty ?? d.specialty}
                              onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                              className="h-11 rounded-xl border border-black/10 bg-white px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-sm font-medium text-gray-700">Consultation Fee</span>
                            <input
                              type="number"
                              name="consultationFee"
                              value={updateDoctor.consultationFee ?? d.consultationFee}
                              onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                              min={0}
                              step="0.01"
                              className="h-11 rounded-xl border border-black/10 bg-white px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            />
                          </label>
                          <label className="grid gap-1">
                            <span className="text-sm font-medium text-gray-700">Active Status</span>
                            <select
                              name="isActive"
                              value={(updateDoctor.isActive ?? d.isActive).toString()}
                              onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                              className="h-11 rounded-xl border border-black/10 bg-white px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </label>
                          <div className="flex gap-2 pt-2">
                            <button
                              type="submit"
                              disabled={loading}
                              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {loading ? 'Updating…' : 'Update'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedDoctorId(null)}
                              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="rounded-xl border border-black/5 bg-white p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Update Status</h3>
                        <form
                          onSubmit={(e) => { e.preventDefault(); handleUpdateStatus(d.doctorId); }}
                          className="grid grid-cols-1 gap-4"
                        >
                          <label className="grid gap-1">
                            <span className="text-sm font-medium text-gray-700">Status</span>
                            <select
                              name="isActive"
                              value={updateStatus.isActive.toString()}
                              onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
                              className="h-11 rounded-xl border border-black/10 bg-white px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </label>
                          <label className="grid gap-1">
                            <span className="text-sm font-medium text-gray-700">Reason (if inactive)</span>
                            <input
                              type="text"
                              name="reason"
                              value={updateStatus.reason || ''}
                              onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
                              placeholder="Optional reason"
                              className="h-11 rounded-xl border border-black/10 bg-white px-3 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            />
                          </label>
                          <div className="flex gap-2 pt-2">
                            <button
                              type="submit"
                              disabled={loading}
                              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {loading ? 'Updating…' : 'Update Status'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedDoctorId(null)}
                              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            {/* pagination */}
            {pagination && (
              <div className="flex items-center justify-between border-t border-black/5 p-4">
                <p className="text-xs text-gray-500">
                  Page {pagination.page} of {pagination.pages} • Total: {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPrev || loading}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!pagination.hasNext || loading}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="rounded-2xl border border-black/5 bg-white/80 p-12 text-center text-gray-600 shadow-xl backdrop-blur">
            {loading ? 'Loading doctors…' : 'No doctors found.'}
          </div>
        )}
      </div>
    </div>
  );
}
