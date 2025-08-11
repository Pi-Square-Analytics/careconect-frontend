/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api'; // Import the api instance directly

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
    profile: {
      firstName: string;
      lastName: string;
    };
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
  const [filters, setFilters] = useState({
    specialty: '',
    isActive: '',
    page: '1',
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (filters.specialty) queryParams.append('specialty', filters.specialty);
        if (filters.isActive) queryParams.append('isActive', filters.isActive);
        if (filters.page) queryParams.append('page', filters.page);

        const queryString = queryParams.toString();
        const url = `/doctors/${queryString ? `?${queryString}` : ''}`;

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
        let errorMessage = 'Failed to fetch doctors';
        if (typeof err === 'string') errorMessage = err;
        else if (err?.response?.data?.message) errorMessage = err.response.data.message;
        else if (err?.message) errorMessage = err.message;
        setError(errorMessage);
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
      let errorMessage = 'Failed to create doctor';
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
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
      let errorMessage = 'Failed to update doctor';
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
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
      let errorMessage = 'Failed to update status';
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
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
      let errorMessage = 'Failed to delete doctor';
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
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

    let processedValue: any = value;
    if (name === 'isActive') processedValue = value === 'true';
    else if (name === 'consultationFee') processedValue = parseFloat(value) || 0;

    setState({ ...state, [name]: processedValue });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage.toString() });
  };

  const getDoctorName = (doctor: Doctor) => {
    if (doctor.user?.profile) {
      return `${doctor.user.profile.firstName} ${doctor.user.profile.lastName}`;
    }
    return `${doctor.firstName} ${doctor.lastName}`;
  };

  const getDoctorEmail = (doctor: Doctor) => {
    return doctor.user?.email || doctor.email;
  };

  const getDoctorPhone = (doctor: Doctor) => {
    return doctor.user?.phoneNumber || doctor.phoneNumber;
  };

  if (!user) {
    return <p className="mt-10 text-center text-gray-500">Please log in to view the doctors page.</p>;
  }

  const BRAND = '#C4E1E1';
  const initials = (f?: string, l?: string) => ((f?.[0] ?? '') + (l?.[0] ?? '') || 'D').toUpperCase();

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* Brand ribbon */}
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
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Doctors</h1>
          <p className="mt-1 text-gray-600">
            Manage doctors, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
          </p>
        </header>

        {loading && (
          <div className="rounded-xl border border-black/5 bg-white/80 p-4 text-sm text-gray-600 shadow-sm backdrop-blur">
            Loading...
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-800">Filter Doctors</h2>
            {(pagination?.total || filters.specialty || filters.isActive) && (
              <span className="text-xs text-gray-500">
                {pagination?.total ? `Total: ${pagination.total}` : '—'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                placeholder="e.g., Cardiology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="isActive"
                value={filters.isActive}
                onChange={handleFilterChange}
                className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={newDoctor.firstName}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={newDoctor.lastName}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newDoctor.email}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newDoctor.phoneNumber}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newDoctor.password}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical License Number</label>
                  <input
                    type="text"
                    name="medicalLicenseNumber"
                    value={newDoctor.medicalLicenseNumber}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    value={newDoctor.specialty}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={newDoctor.consultationFee}
                    onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
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
                    className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-xl bg-[var(--brand)]/70 px-4 py-2.5 font-medium text-gray-900 ring-1 ring-[var(--brand)]/60 transition hover:bg-[var(--brand)]/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Creating...' : 'Create Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </details>
        </section>

        {/* Doctor List */}
        {doctors && doctors.length > 0 ? (
          <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
            <h2 className="mb-2 text-base font-medium text-gray-800">
              Doctor List <span className="text-xs text-gray-500">({doctors.length} found)</span>
            </h2>
            <ul className="divide-y divide-black/5">
              {doctors.map((doctor) => (
                <li key={doctor.doctorId} className="py-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-1 ring-black/5">
                        {initials(
                          doctor.user?.profile?.firstName ?? doctor.firstName,
                          doctor.user?.profile?.lastName ?? doctor.lastName
                        )}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{getDoctorName(doctor)}</p>
                        <p className="text-xs text-gray-500">#{doctor.medicalLicenseNumber}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 text-sm">
                      <p className="text-gray-700"><span className="font-medium">Specialty:</span> {doctor.specialty}</p>
                      <p className="text-gray-700"><span className="font-medium">Fee:</span> ${doctor.consultationFee}</p>
                      <p className="text-gray-700"><span className="font-medium">Email:</span> {getDoctorEmail(doctor)}</p>
                      <p className="text-gray-700"><span className="font-medium">Phone:</span> {getDoctorPhone(doctor)}</p>
                      <p className="text-gray-700"><span className="font-medium">Created:</span> {new Date(doctor.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-700">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ring-1 ${doctor.isActive ? 'bg-green-100 text-green-800 ring-green-200' : 'bg-red-100 text-red-800 ring-red-200'}`}>
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDoctorId(doctor.doctorId)}
                      className="rounded-lg bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-900 ring-1 ring-yellow-200 hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor.doctorId)}
                      className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-900 ring-1 ring-red-200 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>

                  {selectedDoctorId === doctor.doctorId && (
                    <div className="mt-4 rounded-xl border border-black/5 bg-gray-50 p-4">
                      <h3 className="mb-3 text-sm font-semibold text-gray-800">Update Doctor</h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateDoctor(doctor.doctorId);
                        }}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Medical License Number</label>
                          <input
                            type="text"
                            name="medicalLicenseNumber"
                            value={updateDoctor.medicalLicenseNumber || doctor.medicalLicenseNumber}
                            onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Specialty</label>
                          <input
                            type="text"
                            name="specialty"
                            value={updateDoctor.specialty || doctor.specialty}
                            onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                          <input
                            type="number"
                            name="consultationFee"
                            value={updateDoctor.consultationFee || doctor.consultationFee}
                            onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Active Status</label>
                          <select
                            name="isActive"
                            value={(updateDoctor.isActive ?? doctor.isActive).toString()}
                            onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            {loading ? 'Updating...' : 'Update'}
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

                      <hr className="my-4" />

                      <h3 className="mb-3 text-sm font-semibold text-gray-800">Update Status</h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateStatus(doctor.doctorId);
                        }}
                        className="grid grid-cols-1 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            name="isActive"
                            value={updateStatus.isActive.toString()}
                            onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Reason (if inactive)</label>
                          <input
                            type="text"
                            name="reason"
                            value={updateStatus.reason || ''}
                            onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
                            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                            placeholder="Optional reason for status change"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            {loading ? 'Updating...' : 'Update Status'}
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
                  )}
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {pagination && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages} • Total Doctors: {pagination.total}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={!pagination.hasPrev || loading}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-300 disabled:opacity-60"
                  >
                    Previous
                  </button>
                  <button
                    disabled={!pagination.hasNext || loading}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-900 hover:bg-gray-300 disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="rounded-2xl border border-black/5 bg-white/80 p-6 text-center text-gray-500 shadow-xl backdrop-blur">
            {loading ? 'Loading doctors...' : 'No doctors found.'}
          </div>
        )}
      </div>
    </div>
  );
}
