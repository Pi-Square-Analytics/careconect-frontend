"use client";

import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Activity,
  Heart,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-teal-100">Here's your health overview for today</p>
      </div>

      {/* Dashboard Cards - 4 squares as specified */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1st Square - Health Tips */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Health Tips</CardTitle>
            <Heart className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">Stay hydrated - drink at least 8 glasses of water daily</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">Take a 10-minute walk after meals to aid digestion</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">Get 7-8 hours of quality sleep each night</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2nd Square - Upcoming Appointment & Recent Payment */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Quick Overview</CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Upcoming Appointment</h4>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                  <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
                  <p className="text-xs text-blue-600">General Checkup</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Recent Payment</h4>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">$150.00</p>
                  <p className="text-xs text-gray-600">Consultation Fee - Paid</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3rd Square - Recent Activities */}
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
            <Activity className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment Booked</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment Completed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Health Update Received</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4th Square - Book Appointment (with accent background) */}
        <Card className="accent-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Book Appointment</CardTitle>
            <Plus className="h-5 w-5 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-teal-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">Schedule your next appointment with your healthcare provider</p>
              <Link href="/patient/book-appointment">
                <button className="btn-primary w-full flex items-center justify-center">
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">72</p>
                <p className="text-sm text-gray-600">Heart Rate (BPM)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">120/80</p>
                <p className="text-sm text-gray-600">Blood Pressure</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8,432</p>
                <p className="text-sm text-gray-600">Steps Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
