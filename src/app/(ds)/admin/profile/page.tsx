'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import { api } from '@/lib/api/api';

export default function ProfilePage() {
  const { user } = useAuthHooks();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/profile');
        setProfile(response.data.data);
      } catch (err) {
        setError((err as any)?.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>Welcome, {user.profile.firstName} {user.profile.lastName}!</p>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {profile && (
        <div>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phoneNumber}</p>
          <p>User Type: {profile.userType}</p>
          <p>Account Status: {profile.accountStatus}</p>
          {/* Add form for PUT /users/profile */}
        </div>
      )}
    </div>
  );
}