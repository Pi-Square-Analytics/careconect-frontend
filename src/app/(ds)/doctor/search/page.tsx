/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import  api  from '@/lib/api/api';

export default function SearchPatientsPage() {
  const { user } = useAuthHooks();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/patients');
        setPatients(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Search Patients</h1>
      <p>Find patients, {user.profile.firstName} {user.profile.lastName}.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {patients.map((patient: any) => (
          <li key={patient.userId}>{patient.profile.firstName} {patient.profile.lastName}</li>
        ))}
      </ul>
      {/* Add search form */}
    </div>
  );
}