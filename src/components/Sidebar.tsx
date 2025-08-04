'use client';

import Link from 'next/link';
import {
  Home,
  Calendar,
  Users,
  FileText,
  CreditCard,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'doctor' | 'patient';
}

export default function Sidebar({ role }: SidebarProps) {
 const navItems = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Manage Appointments', href: '/admin/manage-appointments', icon: Calendar },
    { name: 'Manage Doctors', href: '/admin/manage-doctors', icon: Users },
    { name: 'Manage Schedule', href: '/admin/manage-schedule', icon: Calendar },
    { name: 'Payment Tracking', href: '/admin/payment-tracking', icon: CreditCard },
  ],
  doctor: [
    { name: 'Dashboard', href: '/doctor', icon: Home },
    { name: 'Appointments', href: '/doctor/upcoming-appointments', icon: Calendar },
    { name: 'Patients', href: '/doctor/patient-list', icon: Users },
    { name: 'Consultation Records', href: '/doctor/consultation-records', icon: FileText },
    { name: 'My Schedule', href: '/doctor/my-schedule', icon: Calendar },
  ],
  patient: [
    { name: 'Dashboard', href: '/patient', icon: Home },
    { name: 'Appointments', href: '/patient/appointments', icon: Calendar },
    { name: 'Book Appointments', href: '/patient/book-appointment', icon: Calendar },
    { name: 'Medical Records', href: '/patient/health-updates', icon: FileText },
    { name: 'Payment History', href: '/patient/payment-history', icon: CreditCard },
  ],
};

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-lg font-bold text-teal-600">CareConnect</h2>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems[role].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}