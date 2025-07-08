"use client";

import { useState } from "react";
import { Calendar, Clock, Plus, Edit, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function MySchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const schedule = [
    {
      id: "1",
      date: "2024-12-15",
      startTime: "09:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      status: "active",
      appointments: [
        { id: "1", time: "09:00", patient: "John Doe", type: "Consultation", duration: 30 },
        { id: "2", time: "09:30", patient: "Jane Smith", type: "Follow-up", duration: 30 },
        { id: "3", time: "10:30", patient: "Bob Wilson", type: "Checkup", duration: 45 },
        { id: "4", time: "14:00", patient: "Alice Brown", type: "Consultation", duration: 30 },
        { id: "5", time: "15:00", patient: "Charlie Davis", type: "Treatment", duration: 60 }
      ]
    },
    {
      id: "2",
      date: "2024-12-16",
      startTime: "10:00",
      endTime: "16:00",
      breakStart: "12:30",
      breakEnd: "13:30",
      status: "active",
      appointments: [
        { id: "6", time: "10:00", patient: "David Lee", type: "Consultation", duration: 30 },
        { id: "7", time: "11:00", patient: "Emma Wilson", type: "Follow-up", duration: 30 },
        { id: "8", time: "14:00", patient: "Frank Miller", type: "Treatment", duration: 45 }
      ]
    }
  ];

  const selectedSchedule = schedule.find(s => s.date === selectedDate);

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const handleAddSchedule = () => {
    alert("Add new schedule");
  };

  const handleEditSchedule = () => {
    alert("Edit schedule");
  };

  const generateTimeSlots = (start: string, end: string, breakStart: string, breakEnd: string) => {
    const slots = [];
    const startTime = new Date(`2024-01-01 ${start}`);
    const endTime = new Date(`2024-01-01 ${end}`);
    const breakStartTime = new Date(`2024-01-01 ${breakStart}`);
    const breakEndTime = new Date(`2024-01-01 ${breakEnd}`);

    let current = new Date(startTime);
    while (current < endTime) {
      const timeString = current.toTimeString().slice(0, 5);
      const isBreakTime = current >= breakStartTime && current < breakEndTime;
      
      slots.push({
        time: timeString,
        isBreak: isBreakTime
      });
      
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600">Manage your working hours and appointments</p>
        </div>
        
        <button onClick={handleAddSchedule} className="mt-4 sm:mt-0 btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule
        </button>
      </div>

      {/* Week Navigation */}
      <Card className="dashboard-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly View</CardTitle>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">
                {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const daySchedule = schedule.find(s => s.date === day.toISOString().split('T')[0]);
              const isSelected = day.toISOString().split('T')[0] === selectedDate;
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day.toISOString().split('T')[0])}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-teal-100 border-2 border-teal-500' 
                      : isToday 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-semibold ${isSelected ? 'text-teal-600' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </p>
                    {daySchedule && (
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                        <p className="text-xs text-gray-600 mt-1">
                          {daySchedule.appointments.length} appointments
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Details */}
        <div className="lg:col-span-2">
          <Card className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Schedule for {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
                {selectedSchedule && (
                  <button
                    onClick={handleEditSchedule}
                    className="btn-secondary flex items-center text-sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedSchedule ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No schedule for this day</h3>
                  <p className="text-gray-600">You don't have any scheduled working hours for this date.</p>
                  <button onClick={handleAddSchedule} className="mt-4 btn-primary">
                    Add Schedule
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Working Hours */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Working Hours</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedSchedule.status === 'active' ? 'status-confirmed' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedSchedule.status.charAt(0).toUpperCase() + selectedSchedule.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Start: {selectedSchedule.startTime}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>End: {selectedSchedule.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Break:</span>
                        <span className="ml-1">{selectedSchedule.breakStart} - {selectedSchedule.breakEnd}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Appointments:</span>
                        <span className="ml-1">{selectedSchedule.appointments.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Today's Appointments</h4>
                    <div className="space-y-2">
                      {generateTimeSlots(
                        selectedSchedule.startTime,
                        selectedSchedule.endTime,
                        selectedSchedule.breakStart,
                        selectedSchedule.breakEnd
                      ).map((slot, index) => {
                        const appointment = selectedSchedule.appointments.find(apt => apt.time === slot.time);
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center p-3 rounded-lg border ${
                              slot.isBreak
                                ? 'bg-yellow-50 border-yellow-200'
                                : appointment
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="w-16 text-sm font-medium text-gray-600">
                              {slot.time}
                            </div>
                            <div className="flex-1 ml-4">
                              {slot.isBreak ? (
                                <span className="text-yellow-700 font-medium">Break Time</span>
                              ) : appointment ? (
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2 text-blue-600" />
                                  <div>
                                    <span className="font-medium text-gray-900">{appointment.patient}</span>
                                    <span className="text-sm text-gray-600 ml-2">
                                      ({appointment.type}, {appointment.duration} min)
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">Available</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSchedule ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{selectedSchedule.appointments.length}</p>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedSchedule.startTime}
                      </p>
                      <p className="text-xs text-gray-600">Start Time</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedSchedule.endTime}
                      </p>
                      <p className="text-xs text-gray-600">End Time</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedSchedule.breakStart} - {selectedSchedule.breakEnd}
                    </p>
                    <p className="text-xs text-gray-600">Break Time</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>No schedule for selected date</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full btn-secondary text-sm">
                  Block Time Slot
                </button>
                <button className="w-full btn-secondary text-sm">
                  Add Break
                </button>
                <button className="w-full btn-secondary text-sm">
                  View All Appointments
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
