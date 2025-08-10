"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#0080803B] shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CareConnect</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="#about" className="nav-link">
              About us
            </Link>
            <Link href="#services" className="nav-link">
              Services
            </Link>
           
            <Link href="#contact" className="nav-link">
              Contact us
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              <Link href="/login">
                <Button className="bg-[#008080]"  size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#008080]" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/" className="block nav-link">
                Home
              </Link>
              <Link href="#services" className="block nav-link">
                Services
              </Link>
              <Link href="#about" className="block nav-link">
                About
              </Link>
              <Link href="#contact" className="block nav-link">
                Contact
              </Link>
              <div className="pt-4 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="btn-primary w-full" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
