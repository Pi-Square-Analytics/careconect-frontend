"use client";

import { useState } from "react";
import { Calendar, Clock, Plus, Edit, Trash2, User, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageSchedulePage() {
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const doctors = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiology" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Dermatology" },
    { id: "3", name: "Dr. Emily Davis", specialty: "Pediatrics" },
    { id: "4", name: "Dr. Robert Wilson", specialty: "Orthopedics" }
  ];

  const schedules = [
    {
      id: "1",
      doctorId: "1",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-12-15",
      startTime: "09:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      status: "active",
      appointmentSlots: 16,
      bookedSlots: 12
    },
    {
      id: "2",
      doctorId: "2",
      doctorName: "Dr. Michael Chen",
      date: "2024-12-15",
      startTime: "10:00",
      endTime: "16:00",
      breakStart: "12:30",
      breakEnd: "13:30",
      status: "active",
      appointmentSlots: 12,
      bookedSlots: 8
    },
    {
      id: "3",
      doctorId: "3",
      doctorName: "Dr. Emily Davis",
      date: "2024-12-15",
      startTime: "08:00",
      endTime: "16:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      status: "active",
      appointmentSlots: 16,
      bookedSlots: 14
    },
    {
      id: "4",
      doctorId: "1",
      doctorName: "Dr. Sarah Johnson",
      date: "2024-12-16",
      startTime: "09:00",
      endTime: "15:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      status: "inactive",
      appointmentSlots: 12,
      bookedSlots: 0
    }
  ];

  const filteredSchedules = schedules.filter(schedule => {
    const matchesDoctor = selectedDoctor === "all" || schedule.doctorId === selectedDoctor;
    const matchesDate = schedule.date === selectedDate;
    return matchesDoctor && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "status-confirmed";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "break":
        return "status-pending";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUtilizationColor = (booked: number, total: number) => {
    const percentage = (booked / total) * 100;
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const handleAddSchedule = () => {
    alert("Add new schedule");
  };

  const handleEditSchedule = (scheduleId: string) => {
    alert(`Edit schedule ${scheduleId}`);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      alert(`Delete schedule ${scheduleId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Schedule</h1>
          <p className="text-gray-600">Create and manage doctor schedules and availability</p>
        </div>
        
        <button onClick={handleAddSchedule} className="mt-4 sm:mt-0 btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Doctor</label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredSchedules.filter(s => s.status === "active").length}</p>
                <p className="text-sm text-gray-600">Active Schedules</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredSchedules.reduce((sum, s) => sum + s.appointmentSlots, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredSchedules.reduce((sum, s) => sum + s.bookedSlots, 0)}
                </p>
                <p className="text-sm text-gray-600">Booked Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((filteredSchedules.reduce((sum, s) => sum + s.bookedSlots, 0) / 
                    Math.max(filteredSchedules.reduce((sum, s) => sum + s.appointmentSlots, 0), 1)) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>
            Doctor Schedules for {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
              <p className="text-gray-600">No schedules found for the selected date and doctor.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {/* Doctor Avatar */}
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-teal-600">
                        {schedule.doctorName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Schedule Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{schedule.doctorName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(schedule.status)}`}>
                          {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Break:</span>
                          <span className="ml-1">{schedule.breakStart} - {schedule.breakEnd}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Slots:</span>
                          <span className={`ml-1 ${getUtilizationColor(schedule.bookedSlots, schedule.appointmentSlots)}`}>
                            {schedule.bookedSlots}/{schedule.appointmentSlots}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full" 
                            style={{ width: `${(schedule.bookedSlots / schedule.appointmentSlots) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((schedule.bookedSlots / schedule.appointmentSlots) * 100)}% booked
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSchedule(schedule.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit schedule"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete schedule"
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
