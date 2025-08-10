'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

export default function AllergiesPage() {
  const { user } = useAuthHooks();
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllergies = async () => {
      setLoading(true);
      try {
        const response = await api.get('/patient/allergies');
        setAllergies(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch allergies');
      } finally {
        setLoading(false);
      }
    };
    fetchAllergies();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Allergies</h1>
      <p>Manage your allergies, {user.profile.firstName} {user.profile.lastName}.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {allergies.map((item: any) => (
          <li key={item.allergyId}>{item.allergenName} - {item.reactionSeverity}</li>
        ))}
      </ul>
      {/* Add form for POST /patient/allergies */}
    </div>
  );
}