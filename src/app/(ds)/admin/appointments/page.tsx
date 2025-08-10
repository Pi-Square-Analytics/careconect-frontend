'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

export default function AdminAppointmentsPage() {
  const { user } = useAuthHooks();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await api.get('/appointments/');
        setAppointments(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    if (user?.userType === 'admin') fetchAppointments();
  }, [user]);

  if (!user || user.userType !== 'admin') return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">All Appointments</h1>
      <p>Manage all appointments, {user.profile.firstName} {user.profile.lastName}.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {appointments.map((appointment: any) => (
          <li key={appointment.appointmentId}>
            {appointment.scheduledDate} - {appointment.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
