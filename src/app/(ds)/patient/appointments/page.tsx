/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import  api  from '@/lib/api/api';


interface Doctor {
  doctorId: string;
  specialty: string;
  consultationFee: string;
  isActive: boolean;
  user: {
    profile: {
      firstName: string;
      lastName: string;
    };
  };
}

interface Appointment {
  appointmentId: string;
  doctorId: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  notes?: string;
  doctor?: {
    firstName: string;
    lastName: string;
    specialty: string;
  };
}

interface AvailabilitySlot {
  time: string;
  available: boolean;
}

interface NewAppointment {
  doctorId: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  notes: string;
}

interface RescheduleAppointment {
  scheduledDate: string;
  scheduledTime: string;
}

interface CancelAppointment {
  cancellationReason: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: string;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  error?: string;
}

export default function PatientAppointmentsPage() {
  const { user } = useAuthHooks();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [appointmentsPagination, setAppointmentsPagination] = useState<ApiResponse<Appointment[]>['pagination'] | null>(null);
  const [doctorsPagination, setDoctorsPagination] = useState<ApiResponse<Doctor[]>['pagination'] | null>(null);
  const [loadingState, setLoadingState] = useState({
    fetchingAppointments: false,
    fetchingDoctors: false,
    fetchingAvailability: false,
    booking: false,
    rescheduling: false,
    canceling: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    doctorId: '',
    appointmentType: 'consultation',
    scheduledDate: '',
    scheduledTime: '',
    reason: '',
    notes: '',
  });
  const [rescheduleAppointment, setRescheduleAppointment] = useState<RescheduleAppointment>({
    scheduledDate: '',
    scheduledTime: '',
  });
  const [cancelAppointment, setCancelAppointment] = useState<CancelAppointment>({
    cancellationReason: '',
  });
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [doctorFilters, setDoctorFilters] = useState<{
    specialty: string;
    search: string;
    minFee: string;
    maxFee: string;
    page: number;
  }>({
    specialty: '',
    search: '',
    minFee: '',
    maxFee: '',
    page: 1,
  });
  const [appointmentsFilters, setAppointmentsFilters] = useState<{ page: number }>({ page: 1 });

  // Helper function to format time for API (HH:mm:ss)
  const formatTimeForAPI = (time: string): string => {
    if (!time || !time.includes(':')) return time;
    return time.length === 5 ? `${time}:00` : time;
  };

  // Helper function to display time (HH:mm)
  const formatTimeForDisplay = (time: string): string => {
    return time.substring(0, 5);
  };

  // Helper function to validate date/time
  const isValidFutureDateTime = (date: string, time: string): boolean => {
    if (!date || !time) return false;
    try {
      const appointmentDateTime = new Date(`${date}T${formatTimeForAPI(time)}`);
      const now = new Date();
      return appointmentDateTime > now;
    } catch {
      return false;
    }
  };

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!user || user.userType !== 'patient') {
      setError('User not authenticated or not a patient');
      return;
    }

    setLoadingState((prev) => ({ ...prev, fetchingAppointments: true }));
    setError(null);
    try {
      const response = await api.get<ApiResponse<Appointment[]>>(`/appointments/my-appointments`);
      console.log('Appointments API Response:', response.data);
      setAppointments(Array.isArray(response.data.data) ? response.data.data : []);
      setAppointmentsPagination(response.data.pagination || null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch appointments';
      setError(errorMessage);
      setAppointments([]);
    } finally {
      setLoadingState((prev) => ({ ...prev, fetchingAppointments: false }));
    }
  }, [user, appointmentsFilters.page]);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, fetchingDoctors: true }));
    setError(null);
    try {
      const response = await api.get<ApiResponse<Doctor[]>>(`/doctors/public/search`);
      console.log('Doctors API Response:', response.data);
      setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
      setDoctorsPagination(response.data.pagination || null);
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch doctors';
      setError(errorMessage);
      setDoctors([]);
    } finally {
      setLoadingState((prev) => ({ ...prev, fetchingDoctors: false }));
    }
  }, [doctorFilters]);

  // Fetch availability slots for selected doctor and date
  const fetchAvailability = useCallback(async (doctorId: string, date: string) => {
    if (!doctorId || !date) {
      setAvailabilitySlots([]);
      return;
    }

    setLoadingState((prev) => ({ ...prev, fetchingAvailability: true }));
    try {
      const response = await api.get<ApiResponse<AvailabilitySlot[]>>(`/appointments/availability/${doctorId}/${date}`);
      console.log('Availability API Response:', response.data);
      setAvailabilitySlots(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err: any) {
      console.error('Error fetching availability:', err);
      setAvailabilitySlots([]);
      // Don't set error to avoid disrupting the form, as availability is supplementary
    } finally {
      setLoadingState((prev) => ({ ...prev, fetchingAvailability: false }));
    }
  }, []);

  useEffect(() => {
    if (user?.userType === 'patient') {
      fetchAppointments();
      fetchDoctors();
    }
  }, [user, fetchAppointments, fetchDoctors]);

  // Fetch availability when doctor or date changes
  useEffect(() => {
    if (newAppointment.doctorId && newAppointment.scheduledDate) {
      fetchAvailability(newAppointment.doctorId, newAppointment.scheduledDate);
    } else {
      setAvailabilitySlots([]);
    }
  }, [newAppointment.doctorId, newAppointment.scheduledDate, fetchAvailability]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 'patient') {
      setError('You must be a patient to book an appointment');
      return;
    }
    if (!newAppointment.doctorId || !newAppointment.scheduledDate || !newAppointment.scheduledTime || !newAppointment.reason) {
      setError('Doctor, date, time, and reason are required');
      return;
    }
    if (!isValidFutureDateTime(newAppointment.scheduledDate, newAppointment.scheduledTime)) {
      setError('Cannot schedule appointments in the past');
      return;
    }

    // Check if selected time slot is available
    const selectedSlot = availabilitySlots.find((slot) => slot.time === formatTimeForAPI(newAppointment.scheduledTime));
    if (selectedSlot && !selectedSlot.available) {
      setError('Selected time slot is not available');
      return;
    }

    setLoadingState((prev) => ({ ...prev, booking: true }));
    setError(null);
    try {
      const response = await api.post<ApiResponse<Appointment>>('/appointments/book', {
        ...newAppointment,
        scheduledTime: formatTimeForAPI(newAppointment.scheduledTime),
      });
      console.log('Book Appointment Response:', response.data);
      await fetchAppointments();
      setNewAppointment({
        doctorId: '',
        appointmentType: 'consultation',
        scheduledDate: '',
        scheduledTime: '',
        reason: '',
        notes: '',
      });
      setAvailabilitySlots([]);
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to book appointment';
      setError(errorMessage);
    } finally {
      setLoadingState((prev) => ({ ...prev, booking: false }));
    }
  };

  const handleRescheduleAppointment = async (appointmentId: string) => {
    if (!user || user.userType !== 'patient') {
      setError('You must be a patient to reschedule an appointment');
      return;
    }
    if (!rescheduleAppointment.scheduledDate || !rescheduleAppointment.scheduledTime) {
      setError('Date and time are required');
      return;
    }
    if (!isValidFutureDateTime(rescheduleAppointment.scheduledDate, rescheduleAppointment.scheduledTime)) {
      setError('Cannot reschedule to a past date/time');
      return;
    }

    setLoadingState((prev) => ({ ...prev, rescheduling: true }));
    setError(null);
    try {
      const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}/reschedule`, {
        ...rescheduleAppointment,
        scheduledTime: formatTimeForAPI(rescheduleAppointment.scheduledTime),
      });
      console.log('Reschedule Appointment Response:', response.data);
      await fetchAppointments();
      setSelectedAppointmentId(null);
      setRescheduleAppointment({ scheduledDate: '', scheduledTime: '' });
    } catch (err: any) {
      console.error('Error rescheduling appointment:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to reschedule appointment';
      setError(errorMessage);
    } finally {
      setLoadingState((prev) => ({ ...prev, rescheduling: false }));
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    if (!user || user.userType !== 'patient') {
      setError('You must be a patient to cancel an appointment');
      return;
    }
    if (!cancelAppointment.cancellationReason.trim()) {
      setError('Cancellation reason is required');
      return;
    }

    setLoadingState((prev) => ({ ...prev, canceling: true }));
    setError(null);
    try {
      const response = await api.put<ApiResponse<Appointment>>(`/appointments/${appointmentId}/cancel`, cancelAppointment);
      console.log('Cancel Appointment Response:', response.data);
      await fetchAppointments();
      setSelectedAppointmentId(null);
      setCancelAppointment({ cancellationReason: '' });
    } catch (err: any) {
      console.error('Error canceling appointment:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to cancel appointment';
      setError(errorMessage);
    } finally {
      setLoadingState((prev) => ({ ...prev, canceling: false }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    setState: React.Dispatch<React.SetStateAction<any>>,
    state: any
  ) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleDoctorFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDoctorFilters({ ...doctorFilters, [e.target.name]: e.target.value, page: 1 });
  };

  const resetDoctorFilters = () => {
    setDoctorFilters({ specialty: '', search: '', minFee: '', maxFee: '', page: 1 });
  };

  const handleTimeSlotSelect = (time: string) => {
    setNewAppointment({ ...newAppointment, scheduledTime: formatTimeForDisplay(time) });
  };

  if (!user || user.userType !== 'patient') {
    return (
      <div className="p-6">
        <p className="text-red-500">Please log in as a patient to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      <p className="mb-6 text-gray-600">
        Manage your appointments, {user.profile.firstName} {user.profile.lastName}.
      </p>

      {(loadingState.fetchingAppointments || loadingState.fetchingDoctors || loadingState.fetchingAvailability || loadingState.booking || loadingState.rescheduling || loadingState.canceling) && (
        <div className="flex items-center justify-center mb-6">
          <p className="text-blue-500">Loading...</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => {
              setError(null);
              if (user?.userType === 'patient') {
                setAppointmentsFilters({ page: 1 });
                setDoctorFilters({ ...doctorFilters, page: 1 });
                fetchAppointments();
                fetchDoctors();
              }
            }}
            className="ml-4 text-sm underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Book Appointment Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Book New Appointment</h2>
        <form onSubmit={handleCreateAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor *</label>
            <select
              name="doctorId"
              value={newAppointment.doctorId}
              onChange={(e) => handleInputChange(e, setNewAppointment, newAppointment)}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.user.profile.firstName} {doctor.user.profile.lastName} - {doctor.specialty} (${doctor.consultationFee})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
            <select
              name="appointmentType"
              value={newAppointment.appointmentType}
              onChange={(e) => handleInputChange(e, setNewAppointment, newAppointment)}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              name="scheduledDate"
              value={newAppointment.scheduledDate}
              onChange={(e) => handleInputChange(e, setNewAppointment, newAppointment)}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time *</label>
            <input
              type="time"
              name="scheduledTime"
              value={newAppointment.scheduledTime}
              onChange={(e) => handleInputChange(e, setNewAppointment, newAppointment)}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {availabilitySlots.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {availabilitySlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-2 text-sm rounded border ${
                      slot.available
                        ? newAppointment.scheduledTime === formatTimeForDisplay(slot.time)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {formatTimeForDisplay(slot.time)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason *</label>
            <input
              type="text"
              name="reason"
              value={newAppointment.reason}
              onChange={(e) => handleInputChange(e, setNewAppointment, newAppointment)}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Regular checkup"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newAppointment.notes}
              onChange={(e) => handleInputChange(e, setNewAppointment, newAppointment)}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              placeholder="Additional information (optional)"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loadingState.booking}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loadingState.booking ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>

      {/* Doctor Search Filters */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Search Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={doctorFilters.specialty}
              onChange={handleDoctorFilterChange}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., cardiology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              name="search"
              value={doctorFilters.search}
              onChange={handleDoctorFilterChange}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Dr. Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Fee ($)</label>
            <input
              type="number"
              name="minFee"
              value={doctorFilters.minFee}
              onChange={handleDoctorFilterChange}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 50"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Fee ($)</label>
            <input
              type="number"
              name="maxFee"
              value={doctorFilters.maxFee}
              onChange={handleDoctorFilterChange}
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 100"
              min="0"
            />
          </div>
          <div className="md:col-span-3">
            <button
              onClick={resetDoctorFilters}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
            >
              Reset Filters
            </button>
            <button
              onClick={fetchDoctors}
              disabled={loadingState.fetchingDoctors}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loadingState.fetchingDoctors ? 'Searching...' : 'Search Doctors'}
            </button>
          </div>
        </div>
        {doctors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Available Doctors</h3>
            <div className="space-y-2">
              {doctors.map((doctor) => (
                <div key={doctor.doctorId} className="border p-3 rounded">
                  <p>
                    <strong>Name:</strong> {doctor.user.profile.firstName} {doctor.user.profile.lastName}
                  </p>
                  <p>
                    <strong>Specialty:</strong> {doctor.specialty}
                  </p>
                  <p>
                    <strong>Fee:</strong> ${doctor.consultationFee}
                  </p>
                  <p>
                    <strong>Status:</strong> {doctor.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {doctorsPagination && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Page {doctorsPagination.page} of {doctorsPagination.pages} | Total Doctors: {doctorsPagination.total}
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                disabled={!doctorsPagination.hasPrev || loadingState.fetchingDoctors}
                onClick={() =>
                  setDoctorFilters({
                    ...doctorFilters,
                    page: doctorsPagination.page - 1,
                  })
                }
                className="bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Previous
              </button>
              <button
                disabled={!doctorsPagination.hasNext || loadingState.fetchingDoctors}
                onClick={() =>
                  setDoctorFilters({
                    ...doctorFilters,
                    page: doctorsPagination.page + 1,
                  })
                }
                className="bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">My Appointments</h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.appointmentId} className="border p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <p>
                    <strong>Date:</strong> {new Date(appointment.scheduledDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTimeForDisplay(appointment.scheduledTime)}
                  </p>
                  <p>
                    <strong>Doctor:</strong>{' '}
                    {appointment.doctor
                      ? `${appointment.doctor.firstName} ${appointment.doctor.lastName} (${appointment.doctor.specialty})`
                      : 'Unknown Doctor'}
                  </p>
                  <p>
                    <strong>Type:</strong> {appointment.appointmentType}
                  </p>
                </div>
                <p className="mb-2">
                  <strong>Reason:</strong> {appointment.reason}
                </p>
                {appointment.notes && (
                  <p className="mb-3">
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setSelectedAppointmentId(
                        selectedAppointmentId === appointment.appointmentId ? null : appointment.appointmentId
                      )
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    {selectedAppointmentId === appointment.appointmentId ? 'Hide Actions' : 'Reschedule/Cancel'}
                  </button>
                </div>
                {selectedAppointmentId === appointment.appointmentId && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    {/* Reschedule Section */}
                    <div className="mb-6">
                      <h3 className="text-md font-semibold mb-3">Reschedule Appointment</h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleRescheduleAppointment(appointment.appointmentId);
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Date *</label>
                          <input
                            type="date"
                            name="scheduledDate"
                            value={rescheduleAppointment.scheduledDate}
                            onChange={(e) => handleInputChange(e, setRescheduleAppointment, rescheduleAppointment)}
                            className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">New Time *</label>
                          <input
                            type="time"
                            name="scheduledTime"
                            value={rescheduleAppointment.scheduledTime}
                            onChange={(e) => handleInputChange(e, setRescheduleAppointment, rescheduleAppointment)}
                            className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div className="md:col-span-2 flex space-x-2">
                          <button
                            type="submit"
                            disabled={loadingState.rescheduling}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {loadingState.rescheduling ? 'Rescheduling...' : 'Reschedule'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRescheduleAppointment({ scheduledDate: '', scheduledTime: '' });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            Clear
                          </button>
                        </div>
                      </form>
                    </div>
                    {/* Cancel Section */}
                    <div className="border-t pt-4">
                      <h3 className="text-md font-semibold mb-3">Cancel Appointment</h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleCancelAppointment(appointment.appointmentId);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cancellation Reason *</label>
                          <textarea
                            name="cancellationReason"
                            value={cancelAppointment.cancellationReason}
                            onChange={(e) => handleInputChange(e, setCancelAppointment, cancelAppointment)}
                            className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500"
                            placeholder="Please provide a reason for cancellation"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            disabled={loadingState.canceling}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {loadingState.canceling ? 'Canceling...' : 'Cancel Appointment'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCancelAppointment({ cancellationReason: '' });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            Clear
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAppointmentId(null);
                          setRescheduleAppointment({ scheduledDate: '', scheduledTime: '' });
                          setCancelAppointment({ cancellationReason: '' });
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {appointmentsPagination && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">
                Page {appointmentsPagination.page} of {appointmentsPagination.pages} | Total Appointments: {appointmentsPagination.total}
              </p>
              <div className="flex space-x-2">
                <button
                  disabled={!appointmentsPagination.hasPrev || loadingState.fetchingAppointments}
                  onClick={() =>
                    setAppointmentsFilters({
                      ...appointmentsFilters,
                      page: appointmentsPagination.page - 1,
                    })
                  }
                  className="bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Previous
                </button>
                <button
                  disabled={!appointmentsPagination.hasNext || loadingState.fetchingAppointments}
                  onClick={() =>
                    setAppointmentsFilters({
                      ...appointmentsFilters,
                      page: appointmentsPagination.page + 1,
                    })
                  }
                  className="bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        !loadingState.fetchingAppointments && (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        )
      )}
    </div>
  );
}