"use client";

import { useState } from "react";
import { Heart, Activity, TrendingUp, Calendar, FileText, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HealthUpdatesPage() {
  const [filter, setFilter] = useState("all");

  const healthUpdates = [
    {
      id: "1",
      type: "vital_signs",
      title: "Blood Pressure Reading",
      value: "120/80 mmHg",
      date: "2024-12-10",
      status: "normal",
      doctor: "Dr. Sarah Johnson",
      notes: "Blood pressure within normal range. Continue current medication."
    },
    {
      id: "2",
      type: "lab_results",
      title: "Blood Test Results",
      value: "Complete Blood Count",
      date: "2024-12-08",
      status: "normal",
      doctor: "Dr. Michael Chen",
      notes: "All values within normal limits. Hemoglobin: 14.2 g/dL, WBC: 7,200/μL"
    },
    {
      id: "3",
      type: "medication",
      title: "Prescription Update",
      value: "Lisinopril 10mg",
      date: "2024-12-05",
      status: "active",
      doctor: "Dr. Sarah Johnson",
      notes: "Dosage adjusted. Take once daily with food."
    },
    {
      id: "4",
      type: "vital_signs",
      title: "Heart Rate Monitor",
      value: "72 BPM",
      date: "2024-12-03",
      status: "normal",
      doctor: "Self-recorded",
      notes: "Resting heart rate recorded during morning routine."
    },
    {
      id: "5",
      type: "appointment",
      title: "Follow-up Consultation",
      value: "Cardiology Review",
      date: "2024-11-28",
      status: "completed",
      doctor: "Dr. Sarah Johnson",
      notes: "Patient showing good progress. Next appointment in 3 months."
    }
  ];

  const filteredUpdates = healthUpdates.filter(update => {
    if (filter === "all") return true;
    return update.type === filter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vital_signs":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "lab_results":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "medication":
        return <Activity className="w-5 h-5 text-green-500" />;
      case "appointment":
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return "status-confirmed";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "attention":
        return "status-pending";
      case "critical":
        return "status-cancelled";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vital_signs":
        return "Vital Signs";
      case "lab_results":
        return "Lab Results";
      case "medication":
        return "Medication";
      case "appointment":
        return "Appointment";
      default:
        return "Other";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Updates</h1>
          <p className="text-gray-600">Track your health progress and medical updates</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {/* Filter */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter updates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Updates</SelectItem>
              <SelectItem value="vital_signs">Vital Signs</SelectItem>
              <SelectItem value="lab_results">Lab Results</SelectItem>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Add Update Button */}
          <button className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Update
          </button>
        </div>
      </div>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Heart className="h-6 w-6 text-red-600" />
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
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Activity className="h-6 w-6 text-blue-600" />
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
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.6°F</p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{healthUpdates.length}</p>
                <p className="text-sm text-gray-600">Total Updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Updates Timeline */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Recent Health Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
              <p className="text-gray-600">No health updates match your current filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <div key={update.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(update.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                        <span className="text-sm text-gray-500">({getTypeLabel(update.type)})</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(update.status)}`}>
                        {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Value/Result:</p>
                        <p className="font-medium text-gray-900">{update.value}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date:</p>
                        <p className="font-medium text-gray-900">
                          {new Date(update.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Healthcare Provider:</p>
                      <p className="font-medium text-gray-900">{update.doctor}</p>
                    </div>
                    
                    {update.notes && (
                      <div>
                        <p className="text-sm text-gray-600">Notes:</p>
                        <p className="text-gray-900">{update.notes}</p>
                      </div>
                    )}
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
