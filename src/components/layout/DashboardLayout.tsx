"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: "patient" | "admin" | "doctor";
  userName: string;
  userAvatar?: string;
}

export default function DashboardLayout({
  children,
  userRole,
  userName,
  userAvatar,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole={userRole} userName={userName} userAvatar={userAvatar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar userName={userName} userAvatar={userAvatar} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
