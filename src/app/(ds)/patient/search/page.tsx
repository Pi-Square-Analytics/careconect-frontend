'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

export default function SearchDoctorsPage() {
  const { user } = useAuthHooks();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await api.get('/search/doctors');
        setDoctors(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Search Doctors</h1>
      <p>Find doctors, {user.profile.firstName} {user.profile.lastName}.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {doctors.map((doctor: any) => (
          <li key={doctor.doctorId}>{doctor.profile.firstName} {doctor.profile.lastName} - {doctor.specialty}</li>
        ))}
      </ul>
      {/* Add search form */}
    </div>
  );
}