'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthHooks } from '@/hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuthHooks();
  const pathname = usePathname();

  // Define role-based navigation links
  const navLinks = user?.userType === 'patient'
    ? [
        { name: 'Dashboard', href: '/patient' },
        { name: 'Profile', href: '/profile' },
        { name: 'Appointments', href: '/appointments' },
        { name: 'Messages', href: '/messages' },
      ]
    : user?.userType === 'admin'
    ? [
        { name: 'Admin Dashboard', href: '/admin' },
        { name: 'Users', href: '/users' },
        { name: 'Reports', href: '/reports' },
      ]
    : user?.userType === 'doctor'
    ? [
        { name: 'Doctor Dashboard', href: '/doctor' },
        { name: 'Schedule', href: '/schedule' },
        { name: 'Patients', href: '/patients' },
      ]
    : [];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">CareConnect</h2>
        <nav className="mt-6">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2 px-4 rounded-md ${
                    pathname === link.href ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}