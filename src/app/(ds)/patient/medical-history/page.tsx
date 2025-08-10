'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

export default function MedicalHistoryPage() {
  const { user } = useAuthHooks();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await api.get('/patient/medical-history');
        setHistory(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch medical history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Medical History</h1>
      <p>Manage your medical history, {user.profile.firstName} {user.profile.lastName}.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {history.map((item: any) => (
          <li key={item.historyId}>{item.conditionName} - {item.onsetDate}</li>
        ))}
      </ul>
      {/* Add form for POST /patient/medical-history */}
    </div>
  );
}