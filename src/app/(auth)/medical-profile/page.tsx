'use client';

import { useAuthHooks } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, handleLogout } = useAuthHooks();

  // Add loading state check
  if (!user) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p>Welcome, {user.profile.firstName} {user.profile.lastName}!</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>User Type: {user.userType}</p>
      <p>Account Status: {user.accountStatus}</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}