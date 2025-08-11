// app/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

interface User {
  doctorId: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

interface Doctor {
  userId: string;
  specialty: string;
  consultationFee: string;
  isActive: boolean;
}

interface Availability {
  availabilityId: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  doctor: Doctor;
}

interface NewAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

interface UpdateAvailability {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
  isActive?: boolean;
}

interface UpdateStatus {
  status: boolean;
}

interface BulkUpdate {
  doctorId: string;
  dayOfWeek: number;
  isActive: boolean;
  reason?: string;
}

export default function SchedulePage() {
  const { user } = useAuthHooks();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAvailability, setNewAvailability] = useState<NewAvailability>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isActive: true,
  });
  const [updateAvailability, setUpdateAvailability] = useState<UpdateAvailability>({});
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({ status: true });
  const [bulkUpdate, setBulkUpdate] = useState<BulkUpdate>({
    doctorId: user?.doctorId || '',
    dayOfWeek: 1,
    isActive: false,
    reason: '',
  });
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user?.doctorId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Availability[]>(`/schedule/doctors/${user.doctorId}/availability`);
        console.log('API Response:', response.data);
        setAvailability(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch availability');
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.doctorId) {
      fetchAvailability();
    }
  }, [user?.doctorId]);

  // Update bulkUpdate.doctorId when user changes
  useEffect(() => {
    if (user?.doctorId) {
      setBulkUpdate((prev) => ({ ...prev, doctorId: user.doctorId }));
    }
  }, [user?.doctorId]);

  const handleCreateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.doctorId) {
      setError('Doctor ID is required');
      return;
    }

    // Validate startTime < endTime
    if (newAvailability.startTime >= newAvailability.endTime) {
      setError('Start time must be before end time');
      return;
    }
    if (newAvailability.slotDuration <= 0) {
      setError('Slot duration must be positive');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formattedAvailability = {
        ...newAvailability,
        doctorId: user.doctorId,
        startTime: `${newAvailability.startTime}:00`,
        endTime: `${newAvailability.endTime}:00`,
      };
      await api.post(`/schedule/doctors/${user.doctorId}/availability`, formattedAvailability);
      const response = await api.get<Availability[]>(`/schedule/doctors/${user.doctorId}/availability`);
      setAvailability(Array.isArray(response.data) ? response.data : []);
      setNewAvailability({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
        isActive: true,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create availability');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async (availabilityId: string) => {
    if (!user?.doctorId) {
      setError('Doctor ID is required');
      return;
    }

    // Validate startTime < endTime if both are provided
    if (updateAvailability.startTime && updateAvailability.endTime && updateAvailability.startTime >= updateAvailability.endTime) {
      setError('Start time must be before end time');
      return;
    }
    if (updateAvailability.slotDuration && updateAvailability.slotDuration <= 0) {
      setError('Slot duration must be positive');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formattedUpdate = { ...updateAvailability };
      if (formattedUpdate.startTime && !formattedUpdate.startTime.includes(':00')) {
        formattedUpdate.startTime = `${formattedUpdate.startTime}:00`;
      }
      if (formattedUpdate.endTime && !formattedUpdate.endTime.includes(':00')) {
        formattedUpdate.endTime = `${formattedUpdate.endTime}:00`;
      }
      await api.patch(`/schedule/availability/${availabilityId}`, formattedUpdate);
      const response = await api.get<Availability[]>(`/schedule/doctors/${user.doctorId}/availability`);
      setAvailability(Array.isArray(response.data) ? response.data : []);
      setSelectedAvailabilityId(null);
      setUpdateAvailability({});
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (availabilityId: string) => {
    if (!user?.doctorId) {
      setError('Doctor ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.patch(`/schedule/availability/${availabilityId}/status`, updateStatus);
      const response = await api.get<Availability[]>(`/schedule/doctors/${user.doctorId}/availability`);
      setAvailability(Array.isArray(response.data) ? response.data : []);
      setSelectedAvailabilityId(null);
      setUpdateStatus({ status: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (availabilityId: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) return;
    if (!user?.doctorId) {
      setError('Doctor ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.delete(`/schedule/availability/${availabilityId}`);
      const response = await api.get<Availability[]>(`/schedule/doctors/${user.doctorId}/availability`);
      setAvailability(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.doctorId) {
      setError('Doctor ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post(`/schedule/bulk-update`, {
        ...bulkUpdate,
        doctorId: user.doctorId,
      });
      const response = await api.get<Availability[]>(`/schedule/doctors/${user.doctorId}/availability`);
      setAvailability(Array.isArray(response.data) ? response.data : []);
      setBulkUpdate({
        doctorId: user.doctorId,
        dayOfWeek: 1,
        isActive: false,
        reason: '',
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to perform bulk update');
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
    const parsedValue =
      name === 'dayOfWeek' || name === 'slotDuration'
        ? parseInt(value, 10)
        : name === 'isActive' || name === 'status'
        ? value === 'true'
        : value;
    setState({ ...state, [name]: parsedValue });
  };

  // Helper function to format time display (remove seconds)
  const formatTimeDisplay = (time: string) => {
    return time.substring(0, 5); // Returns HH:MM from HH:MM:SS
  };

  if (!user?.doctorId) {
    return <p>Please log in as a doctor to view the schedule page.</p>;
  }

  const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Schedule</h1>
      <p className="mb-4">
        Manage your schedule, {user.profile.firstName} {user.profile.lastName}.
      </p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Availability Form */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Add Availability</h2>
        <form onSubmit={handleCreateAvailability} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Day of Week</label>
            <select
              name="dayOfWeek"
              value={newAvailability.dayOfWeek}
              onChange={(e) => handleInputChange(e, setNewAvailability, newAvailability)}
              className="mt-1 p-2 border rounded w-full"
              required
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={newAvailability.startTime}
              onChange={(e) => handleInputChange(e, setNewAvailability, newAvailability)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={newAvailability.endTime}
              onChange={(e) => handleInputChange(e, setNewAvailability, newAvailability)}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Slot Duration (minutes)</label>
            <input
              type="number"
              name="slotDuration"
              value={newAvailability.slotDuration}
              onChange={(e) => handleInputChange(e, setNewAvailability, newAvailability)}
              className="mt-1 p-2 border rounded w-full"
              min="5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Active Status</label>
            <select
              name="isActive"
              value={newAvailability.isActive.toString()}
              onChange={(e) => handleInputChange(e, setNewAvailability, newAvailability)}
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
              {loading ? 'Creating...' : 'Add Availability'}
            </button>
          </div>
        </form>
      </div>

      {/* Bulk Update Form */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Bulk Update Availability</h2>
        <form onSubmit={handleBulkUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Day of Week</label>
            <select
              name="dayOfWeek"
              value={bulkUpdate.dayOfWeek}
              onChange={(e) => handleInputChange(e, setBulkUpdate, bulkUpdate)}
              className="mt-1 p-2 border rounded w-full"
              required
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Active Status</label>
            <select
              name="isActive"
              value={bulkUpdate.isActive.toString()}
              onChange={(e) => handleInputChange(e, setBulkUpdate, bulkUpdate)}
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
              value={bulkUpdate.reason}
              onChange={(e) => handleInputChange(e, setBulkUpdate, bulkUpdate)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Bulk Update'}
            </button>
          </div>
        </form>
      </div>

      {/* Availability List */}
      {availability && availability.length > 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Availability</h2>
          <ul className="space-y-2">
            {availability.map((slot) => (
              <li key={slot.availabilityId} className="border p-2 rounded">
                <p>
                  <strong>Day:</strong> {daysOfWeek.find((d) => d.value === slot.dayOfWeek)?.label}
                </p>
                <p>
                  <strong>Time:</strong> {formatTimeDisplay(slot.startTime)} to {formatTimeDisplay(slot.endTime)}
                </p>
                <p>
                  <strong>Slot Duration:</strong> {slot.slotDuration} minutes
                </p>
                <p>
                  <strong>Status:</strong> {slot.isActive ? 'Active' : 'Inactive'}
                </p>
                <p>
                  <strong>Created:</strong> {new Date(slot.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong> {new Date(slot.updatedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Specialty:</strong> {slot.doctor.specialty}
                </p>
                <p>
                  <strong>Consultation Fee:</strong> ${slot.doctor.consultationFee}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => setSelectedAvailabilityId(slot.availabilityId)}
                    className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAvailability(slot.availabilityId)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                {selectedAvailabilityId === slot.availabilityId && (
                  <div className="mt-2 p-2 border rounded">
                    <h3 className="text-md font-semibold">Update Availability</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdateAvailability(slot.availabilityId);
                      }}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div>
                        <label className="block text-sm font-medium">Day of Week</label>
                        <select
                          name="dayOfWeek"
                          value={updateAvailability.dayOfWeek ?? slot.dayOfWeek}
                          onChange={(e) => handleInputChange(e, setUpdateAvailability, updateAvailability)}
                          className="mt-1 p-2 border rounded w-full"
                        >
                          {daysOfWeek.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          value={
                            updateAvailability.startTime
                              ? formatTimeDisplay(updateAvailability.startTime)
                              : formatTimeDisplay(slot.startTime)
                          }
                          onChange={(e) => handleInputChange(e, setUpdateAvailability, updateAvailability)}
                          className="mt-1 p-2 border rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          value={
                            updateAvailability.endTime
                              ? formatTimeDisplay(updateAvailability.endTime)
                              : formatTimeDisplay(slot.endTime)
                          }
                          onChange={(e) => handleInputChange(e, setUpdateAvailability, updateAvailability)}
                          className="mt-1 p-2 border rounded w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Slot Duration (minutes)</label>
                        <input
                          type="number"
                          name="slotDuration"
                          value={updateAvailability.slotDuration ?? slot.slotDuration}
                          onChange={(e) => handleInputChange(e, setUpdateAvailability, updateAvailability)}
                          className="mt-1 p-2 border rounded w-full"
                          min="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Active Status</label>
                        <select
                          name="isActive"
                          value={(updateAvailability.isActive ?? slot.isActive).toString()}
                          onChange={(e) => handleInputChange(e, setUpdateAvailability, updateAvailability)}
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
                          onClick={() => {
                            setSelectedAvailabilityId(null);
                            setUpdateAvailability({});
                          }}
                          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-md font-semibold">Update Status Only</h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateStatus(slot.availabilityId);
                        }}
                        className="grid grid-cols-1 gap-2"
                      >
                        <div>
                          <label className="block text-sm font-medium">Status</label>
                          <select
                            name="status"
                            value={updateStatus.status.toString()}
                            onChange={(e) => handleInputChange(e, setUpdateStatus, updateStatus)}
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
                            {loading ? 'Updating...' : 'Update Status'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAvailabilityId(null);
                              setUpdateStatus({ status: true });
                            }}
                            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p>No availability slots found.</p>
      )}
    </div>
  );
}