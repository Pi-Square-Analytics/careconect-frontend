// app/admin/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

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

interface ApiResponse {
  data: {
    doctors: Doctor[];
    pagination?: {
      page: number;
      limit: number;
      total: string;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export default function DoctorsPage() {
  const { user } = useAuthHooks();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<ApiResponse['data']['pagination'] | null>(null);
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
  const [filters, setFilters] = useState({ specialty: '', isActive: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          ...(filters.specialty && { specialty: filters.specialty }),
          ...(filters.isActive && { isActive: filters.isActive }),
        }).toString();
        const response = await api.get<ApiResponse>(`/doctors/?${query}`);
        console.log('API Response:', response.data); // Debug log
        const fetchedDoctors = response.data?.data || [];
        const fetchedPagination = response.data.data?.pagination || null;
        setDoctors(Array.isArray(fetchedDoctors) ? fetchedDoctors : []);
        setPagination(fetchedPagination);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch doctors');
        setDoctors([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDoctors();
    }
  }, [user, filters]);

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/doctors/', newDoctor);
      const response = await api.get<ApiResponse>('/doctors/');
      setDoctors(response.data.data?.doctors || []);
      setPagination(response.data.data?.pagination || null);
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
      setError(err?.response?.data?.message || 'Failed to create doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctor = async (doctorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/doctors/${doctorId}`, updateDoctor);
      const response = await api.get<ApiResponse>('/doctors/');
      setDoctors(response.data.data?.doctors || []);
      setPagination(response.data.data?.pagination || null);
      setSelectedDoctorId(null);
      setUpdateDoctor({});
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (doctorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/doctors/${doctorId}/status`, updateStatus);
      const response = await api.get<ApiResponse>('/doctors/');
      setDoctors(response.data.data?.doctors || []);
      setPagination(response.data.data?.pagination || null);
      setSelectedDoctorId(null);
      setUpdateStatus({ isActive: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update status');
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
      const response = await api.get<ApiResponse>('/doctors/');
      setDoctors(response.data.data?.doctors || []);
      setPagination(response.data.data?.pagination || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<any>>,
    state: any
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (!user) {
    return <p>Please log in to view the doctors page.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>
      <p className="mb-4">
        Manage doctors, {user.profile.firstName} {user.profile.lastName}.
      </p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Filter Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
              placeholder="e.g., cardiology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Create Doctor Form */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Create New Doctor</h2>
        <form onSubmit={handleCreateDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={newDoctor.firstName}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={newDoctor.lastName}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={newDoctor.email}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={newDoctor.phoneNumber}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={newDoctor.password}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Medical License Number</label>
            <input
              type="text"
              name="medicalLicenseNumber"
              value={newDoctor.medicalLicenseNumber}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={newDoctor.specialty}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Consultation Fee</label>
            <input
              type="number"
              name="consultationFee"
              value={newDoctor.consultationFee}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Active Status</label>
            <select
              name="isActive"
              value={newDoctor.isActive.toString()}
              onChange={(e) => handleInputChange(e, setNewDoctor, newDoctor)}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </div>

      {/* Doctor List */}
      {doctors && doctors.length > 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Doctor List</h2>
          <ul className="space-y-2">
            {doctors.map((doctor) => (
              <li key={doctor.doctorId} className="border p-2 rounded">
                <p>
                  <strong>Name:</strong> {doctor.user.profile.firstName} {doctor.user.profile.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {doctor.user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {doctor.user.phoneNumber}
                </p>
                <p>
                  <strong>Specialty:</strong> {doctor.specialty}
                </p>
                <p>
                  <strong>License:</strong> {doctor.medicalLicenseNumber}
                </p>
                <p>
                  <strong>Fee:</strong> ${doctor.consultationFee}
                </p>
                <p>
                  <strong>Status:</strong> {doctor.isActive ? 'Active' : 'Inactive'}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(doctor.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => setSelectedDoctorId(doctor.doctorId)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.doctorId)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                {selectedDoctorId === doctor.doctorId && (
                  <div className="mt-2 p-2 border rounded">
                    <h3 className="text-md font-semibold">Update Doctor</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateDoctor(doctor.doctorId);
                      }}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div>
                        <label className="block text-sm font-medium">Medical License Number</label>
                        <input
                          type="text"
                          name="medicalLicenseNumber"
                          value={updateDoctor.medicalLicenseNumber || doctor.medicalLicenseNumber}
                          onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                          className="mt-1 p-2 border rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Specialty</label>
                        <input
                          type="text"
                          name="specialty"
                          value={updateDoctor.specialty || doctor.specialty}
                          onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                          className="mt-1 p-2 border rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Consultation Fee</label>
                        <input
                          type="number"
                          name="consultationFee"
                          value={updateDoctor.consultationFee || doctor.consultationFee}
                          onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                          className="mt-1 p-2 border rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Active Status</label>
                        <select
                          name="isActive"
                          value={(updateDoctor.isActive ?? doctor.isActive).toString()}
                          onChange={(e) => handleInputChange(e, setUpdateDoctor, updateDoctor)}
                          className="mt-1 p-2 border rounded w-full"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                          {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDoctorId(null)}
                          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    <h3 className="text-md font-semibold mt-4">Update Status</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateStatus(doctor.doctorId);
                      }}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                          name="isActive"
                          value={updateStatus.isActive.toString()}
                          onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
                          className="mt-1 p-2 border rounded w-full"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Reason (if inactive)</label>
                        <input
                          type="text"
                          name="reason"
                          value={updateStatus.reason || ''}
                          onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
                          className="mt-1 p-2 border rounded w-full"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                          {loading ? 'Updating...' : 'Update Status'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDoctorId(null)}
                          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
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
          {pagination && (
            <div className="mt-4">
              <p>
                Page {pagination.page} of {pagination.pages} | Total Doctors: {pagination.total}
              </p>
              <div className="flex space-x-2">
                <button
                  disabled={!pagination.hasPrev || loading}
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
                  disabled={!pagination.hasNext || loading}
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
        <p>No doctors found.</p>
      )}
    </div>
  );
}