"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  CreditCard,
  Heart,
  Users,
  Clock,
  FileText,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  userRole: "patient" | "admin" | "doctor";
  userName: string;
  userAvatar?: string;
}

export default function Sidebar({ userRole, userName, userAvatar }: SidebarProps) {
  const pathname = usePathname();

  const getNavigationItems = () => {
    switch (userRole) {
      case "patient":
        return [
          { href: "/patient", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/patient/book-appointment", icon: Calendar, label: "Book Appointment" },
          { href: "/patient/appointments", icon: CalendarCheck, label: "Appointments" },
          { href: "/patient/payment-history", icon: CreditCard, label: "Payment History" },
          { href: "/patient/health-updates", icon: Heart, label: "Health Updates" },
        ];
      case "admin":
        return [
          { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/admin/manage-doctors", icon: Users, label: "Manage Doctors" },
          { href: "/admin/manage-schedule", icon: Clock, label: "Manage Schedule" },
          { href: "/admin/manage-appointments", icon: CalendarCheck, label: "Manage Appointments" },
          { href: "/admin/payment-tracking", icon: CreditCard, label: "Payment Tracking" },
        ];
      case "doctor":
        return [
          { href: "/doctor", icon: LayoutDashboard, label: "Dashboard" },
          { href: "/doctor/my-schedule", icon: Clock, label: "My Schedule" },
          { href: "/doctor/upcoming-appointments", icon: CalendarCheck, label: "Upcoming Appointments" },
          { href: "/doctor/patient-list", icon: Users, label: "Patient List" },
          { href: "/doctor/consultation-records", icon: FileText, label: "Consultation Records" },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="sidebar-primary h-full w-64 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-teal-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2">
            <span className="text-teal-600 font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-white">CareConnect</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link flex items-center w-full ${
                isActive ? "active bg-teal-700" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-teal-700">
        <div className="flex items-center mb-4">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-teal-700 text-white">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-teal-200 capitalize">{userRole}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link href="/profile" className="sidebar-link flex items-center w-full">
            <User className="w-4 h-4 mr-3" />
            Profile
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="sidebar-link flex items-center w-full justify-start text-white hover:bg-teal-700"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
