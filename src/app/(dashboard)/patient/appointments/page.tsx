"use client";

import { useState } from "react";
import { Calendar, Clock, User, MapPin, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AppointmentsPage() {
  const [filter, setFilter] = useState("all");

  const appointments = [
    {
      id: "1",
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-12-15",
      time: "2:30 PM",
      status: "confirmed",
      reason: "Regular checkup",
      location: "Room 201, Main Building"
    },
    {
      id: "2", 
      doctor: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "2024-12-18",
      time: "10:00 AM",
      status: "pending",
      reason: "Skin consultation",
      location: "Room 105, Dermatology Wing"
    },
    {
      id: "3",
      doctor: "Dr. Emily Davis",
      specialty: "Pediatrics", 
      date: "2024-12-22",
      time: "3:00 PM",
      status: "confirmed",
      reason: "Follow-up visit",
      location: "Room 301, Pediatric Center"
    },
    {
      id: "4",
      doctor: "Dr. Robert Wilson",
      specialty: "Orthopedics",
      date: "2024-12-10",
      time: "11:30 AM", 
      status: "completed",
      reason: "Knee examination",
      location: "Room 150, Orthopedic Clinic"
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === "all") return true;
    return appointment.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "status-cancelled";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReschedule = (appointmentId: string) => {
    alert(`Reschedule appointment ${appointmentId}`);
  };

  const handleCancel = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      alert(`Cancelled appointment ${appointmentId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">View and manage your scheduled appointments</p>
        </div>
        
        {/* Filter */}
        <div className="mt-4 sm:mt-0">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter appointments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="dashboard-card">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No appointments match your current filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="dashboard-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Appointment Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Doctor Avatar */}
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-teal-600" />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {appointment.location}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">Reason:</span>
                            <span className="ml-1">{appointment.reason}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                      <button
                        onClick={() => handleReschedule(appointment.id)}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === "confirmed").length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {appointments.filter(a => a.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {appointments.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
