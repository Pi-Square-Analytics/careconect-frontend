'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface User {
  role: 'admin' | 'doctor' | 'patient';
  name: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role && parsedUser.name) {
          setUser(parsedUser);
        }
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error reading user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">CareConnect Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}