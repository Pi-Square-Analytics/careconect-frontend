'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthHooks } from '@/hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuthHooks();
  const pathname = usePathname();

  const navLinks = user?.userType === 'patient'
    ? [
        { name: 'Dashboard', href: '/patient' },
        { name: 'Profile', href: '/patient/profile' },
        { name: 'Appointments', href: '/patient/appointments' },
        { name: 'Messages', href: '/patient/messages' },
        { name: 'Medical History', href: '/patient/medical-history' },
        { name: 'Allergies', href: '/patient/allergies' },
        { name: 'Medications', href: '/patient/medications' },
        { name: 'Preferences', href: '/patient/preferences' },
        { name: 'Invoices', href: '/patient/invoices' },
        { name: 'Search Doctors', href: '/patient/search/doctors' },
      ]
    : user?.userType === 'admin'
    ? [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Users', href: '/admin/users' },
        { name: 'Doctors', href: '/admin/doctors' },
        { name: 'Reports', href: '/admin/reports' },
        { name: 'Appointments', href: '/admin/appointments' },
        { name: 'Audit Logs', href: '/admin/audit-logs' },
        { name: 'Settings', href: '/admin/settings' },
      ]
    : user?.userType === 'doctor'
    ? [
        { name: 'Dashboard', href: '/doctor' },
        { name: 'Schedule', href: '/doctor/schedule' },
        { name: 'Patients', href: '/doctor/patients' },
        { name: 'Appointments', href: '/doctor/appointments' },
        { name: 'Consultations', href: '/doctor/consultations' },
        { name: 'Invoices', href: '/doctor/invoices' },
        { name: 'Search Patients', href: '/doctor/search/patients' },
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