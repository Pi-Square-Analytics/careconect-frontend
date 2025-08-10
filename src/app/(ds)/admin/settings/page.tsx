'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

export default function SettingsPage() {
  const { user } = useAuthHooks();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/misc/configuration');
        setSettings(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>Manage system settings, {user.profile.firstName} {user.profile.lastName}.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {settings && (
        <div>
          <p>Maintenance: {settings.systemMaintenance ? 'On' : 'Off'}</p>
          {/* Add form for PATCH /admin/settings */}
        </div>
      )}
    </div>
  );
}