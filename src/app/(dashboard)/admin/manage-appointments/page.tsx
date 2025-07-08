"use client";

import { useState } from "react";
import { Calendar, Clock, User, Search, Filter, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const appointments = [
    {
      id: "1",
      patientName: "John Doe",
      patientEmail: "john.doe@email.com",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-12-15",
      time: "2:30 PM",
      status: "confirmed",
      reason: "Regular checkup",
      duration: "30 min"
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientEmail: "jane.smith@email.com",
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "2024-12-15",
      time: "10:00 AM",
      status: "pending",
      reason: "Skin consultation",
      duration: "45 min"
    },
    {
      id: "3",
      patientName: "Bob Wilson",
      patientEmail: "bob.wilson@email.com",
      doctorName: "Dr. Emily Davis",
      specialty: "Pediatrics",
      date: "2024-12-16",
      time: "3:00 PM",
      status: "confirmed",
      reason: "Child checkup",
      duration: "30 min"
    },
    {
      id: "4",
      patientName: "Alice Brown",
      patientEmail: "alice.brown@email.com",
      doctorName: "Dr. Robert Wilson",
      specialty: "Orthopedics",
      date: "2024-12-14",
      time: "11:30 AM",
      status: "completed",
      reason: "Knee examination",
      duration: "60 min"
    },
    {
      id: "5",
      patientName: "Charlie Davis",
      patientEmail: "charlie.davis@email.com",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-12-17",
      time: "9:00 AM",
      status: "cancelled",
      reason: "Heart consultation",
      duration: "45 min"
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
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

  const handleConfirm = (appointmentId: string) => {
    alert(`Confirm appointment ${appointmentId}`);
  };

  const handleCancel = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      alert(`Cancel appointment ${appointmentId}`);
    }
  };

  const handleEdit = (appointmentId: string) => {
    alert(`Edit appointment ${appointmentId}`);
  };

  const handleDelete = (appointmentId: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      alert(`Delete appointment ${appointmentId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
        <p className="text-gray-600">View and manage all patient appointments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by patient, doctor, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === "confirmed").length}</p>
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
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === "completed").length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === "cancelled").length}</p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No appointments match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {/* Patient Avatar */}
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-600" />
                    </div>
                    
                    {/* Appointment Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{appointment.patientEmail}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {appointment.doctorName} ({appointment.specialty})
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {appointment.duration} - {appointment.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => handleConfirm(appointment.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Confirm appointment"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit appointment"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {appointment.status !== "completed" && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Cancel appointment"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete appointment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
