"use client";

import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, FileText, Filter, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpcomingAppointmentsPage() {
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const appointments = [
    {
      id: "1",
      patientName: "John Doe",
      patientEmail: "john.doe@email.com",
      patientPhone: "+1 (555) 123-4567",
      date: "2024-12-15",
      time: "09:00 AM",
      duration: 30,
      type: "Consultation",
      reason: "Regular checkup",
      status: "confirmed",
      notes: "Patient has been experiencing chest pain",
      isFirstVisit: false
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientEmail: "jane.smith@email.com",
      patientPhone: "+1 (555) 234-5678",
      date: "2024-12-15",
      time: "09:30 AM",
      duration: 30,
      type: "Follow-up",
      reason: "Post-surgery checkup",
      status: "confirmed",
      notes: "Follow-up after cardiac procedure",
      isFirstVisit: false
    },
    {
      id: "3",
      patientName: "Bob Wilson",
      patientEmail: "bob.wilson@email.com",
      patientPhone: "+1 (555) 345-6789",
      date: "2024-12-15",
      time: "10:30 AM",
      duration: 45,
      type: "Consultation",
      reason: "Heart palpitations",
      status: "pending",
      notes: "New patient - first consultation",
      isFirstVisit: true
    },
    {
      id: "4",
      patientName: "Alice Brown",
      patientEmail: "alice.brown@email.com",
      patientPhone: "+1 (555) 456-7890",
      date: "2024-12-16",
      time: "02:00 PM",
      duration: 30,
      type: "Treatment",
      reason: "Medication adjustment",
      status: "confirmed",
      notes: "Adjust blood pressure medication dosage",
      isFirstVisit: false
    },
    {
      id: "5",
      patientName: "Charlie Davis",
      patientEmail: "charlie.davis@email.com",
      patientPhone: "+1 (555) 567-8901",
      date: "2024-12-17",
      time: "11:00 AM",
      duration: 60,
      type: "Procedure",
      reason: "ECG and stress test",
      status: "confirmed",
      notes: "Comprehensive cardiac evaluation",
      isFirstVisit: false
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filter === "all" || appointment.status === filter;
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    return matchesStatus && matchesDate;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Consultation":
        return "bg-blue-100 text-blue-800";
      case "Follow-up":
        return "bg-green-100 text-green-800";
      case "Treatment":
        return "bg-purple-100 text-purple-800";
      case "Procedure":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleConfirm = (appointmentId: string) => {
    alert(`Confirm appointment ${appointmentId}`);
  };

  const handleCancel = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      alert(`Cancel appointment ${appointmentId}`);
    }
  };

  const handleStartConsultation = (appointmentId: string) => {
    alert(`Start consultation for appointment ${appointmentId}`);
  };

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const upcomingCount = appointments.filter(apt => apt.status === "confirmed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h1>
        <p className="text-gray-600">View and manage your scheduled patient appointments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Appointments</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input-field w-48"
          placeholder="Filter by date"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingCount}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === "pending").length}</p>
                <p className="text-sm text-gray-600">Pending Confirmation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Patient Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No appointments match your current filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {/* Patient Avatar */}
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-teal-600" />
                        </div>
                        
                        {/* Patient Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                            {appointment.isFirstVisit && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                First Visit
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {appointment.patientEmail}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {appointment.patientPhone}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Appointment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="font-medium">
                              {new Date(appointment.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })} at {appointment.time}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="font-medium">{appointment.duration} minutes</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                            {appointment.type}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Reason</p>
                          <p className="font-medium">{appointment.reason}</p>
                        </div>
                      </div>
                      
                      {/* Notes */}
                      {appointment.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start">
                            <FileText className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Notes</p>
                              <p className="text-sm text-gray-900">{appointment.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                      {appointment.status === "pending" && (
                        <button
                          onClick={() => handleConfirm(appointment.id)}
                          className="btn-primary text-sm flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </button>
                      )}
                      
                      {appointment.status === "confirmed" && (
                        <button
                          onClick={() => handleStartConsultation(appointment.id)}
                          className="btn-primary text-sm"
                        >
                          Start Consultation
                        </button>
                      )}
                      
                      {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
