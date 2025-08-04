'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Heart, Bell, Search, LogOut, Menu, X } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
}

interface NavbarProps {
  user?: User | null;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export default function Navbar({ user, showSearch = true, searchPlaceholder = "Search..." }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-blue-100 text-blue-800',
      doctor: 'bg-green-100 text-green-800',
      patient: 'bg-purple-100 text-purple-800',
    };
    
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const isAuthPage = pathname?.startsWith('/auth');
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CareConnect</span>
            </Link>
            
            {/* Role Badge */}
            {user && (
              <span className={`ml-4 px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            {showSearch && isDashboard && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {/* Notifications */}
            {user && (
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
            )}
            
            {/* User Menu or Auth Links */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {user.role === 'doctor' ? `Dr. ${user.name}` : `Welcome, ${user.name}`}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : !isAuthPage && (
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* Search Bar Mobile */}
              {showSearch && isDashboard && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              
              {/* User Info or Auth Links */}
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    {user.role === 'doctor' ? `Dr. ${user.name}` : user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600 text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : !isAuthPage && (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block text-gray-700 hover:text-blue-600 text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
