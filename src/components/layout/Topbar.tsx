'use client';

import { useAuthHooks } from '@/hooks/useAuth';

export default function Topbar() {
  const { user, handleLogout } = useAuthHooks();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">CareConnect</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Welcome, {user.profile.firstName} {user.profile.lastName}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}