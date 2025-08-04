"use client";

import Link from "next/link";
import {
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp,
  UserCheck,
  DollarSign,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Dr. Smith!</h1>
        <p className="text-teal-100">Here&apos;s your practice overview for today</p>
      </div>

      {/* 3 Info Cards (single line) - Same as Admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Today&apos;s Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">$3,250</p>
                <p className="text-sm text-gray-600">Today&apos;s Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Consultation completed with John Doe</p>
                  <p className="text-xs text-gray-500">30 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Medical report submitted for Jane Smith</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New appointment scheduled for tomorrow</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Prescription updated for patient #1234</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad Card (with accent background) */}
        <Card className="accent-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Professional Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-teal-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Join our upcoming medical conference and earn CME credits</p>
              <button className="btn-primary w-full flex items-center justify-center">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/doctor/my-schedule">
          <Card className="dashboard-card hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="font-medium">My Schedule</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/upcoming-appointments">
          <Card className="dashboard-card hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="font-medium">Upcoming Appointments</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/patient-list">
          <Card className="dashboard-card hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="font-medium">Patient List</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/consultation-records">
          <Card className="dashboard-card hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="font-medium">Consultation Records</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
