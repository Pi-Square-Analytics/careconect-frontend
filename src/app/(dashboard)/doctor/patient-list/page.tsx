"use client";

import { useState } from "react";
import { User, Search, Filter, Phone, Mail, Calendar, FileText, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const patients = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      age: 45,
      gender: "Male",
      bloodType: "O+",
      lastVisit: "2024-12-10",
      nextAppointment: "2024-12-20",
      status: "active",
      condition: "Hypertension",
      totalVisits: 12,
      emergencyContact: "+1 (555) 987-6543"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 234-5678",
      age: 32,
      gender: "Female",
      bloodType: "A-",
      lastVisit: "2024-12-08",
      nextAppointment: "2024-12-22",
      status: "active",
      condition: "Diabetes Type 2",
      totalVisits: 8,
      emergencyContact: "+1 (555) 876-5432"
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob.wilson@email.com",
      phone: "+1 (555) 345-6789",
      age: 28,
      gender: "Male",
      bloodType: "B+",
      lastVisit: "2024-11-25",
      nextAppointment: "2024-12-18",
      status: "active",
      condition: "Anxiety",
      totalVisits: 5,
      emergencyContact: "+1 (555) 765-4321"
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice.brown@email.com",
      phone: "+1 (555) 456-7890",
      age: 55,
      gender: "Female",
      bloodType: "AB+",
      lastVisit: "2024-12-05",
      nextAppointment: null,
      status: "inactive",
      condition: "Arthritis",
      totalVisits: 15,
      emergencyContact: "+1 (555) 654-3210"
    },
    {
      id: "5",
      name: "Charlie Davis",
      email: "charlie.davis@email.com",
      phone: "+1 (555) 567-8901",
      age: 38,
      gender: "Male",
      bloodType: "O-",
      lastVisit: "2024-12-12",
      nextAppointment: "2024-12-25",
      status: "active",
      condition: "Migraine",
      totalVisits: 7,
      emergencyContact: "+1 (555) 543-2109"
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "status-confirmed";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "critical":
        return "status-cancelled";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (patientId: string) => {
    alert(`View patient details for ${patientId}`);
  };

  const handleEditPatient = (patientId: string) => {
    alert(`Edit patient ${patientId}`);
  };

  const handleViewRecords = (patientId: string) => {
    alert(`View medical records for patient ${patientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient List</h1>
        <p className="text-gray-600">View and manage your patients</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by name, email, or condition..."
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
            <SelectItem value="all">All Patients</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.length}</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.filter(p => p.status === "active").length}</p>
                <p className="text-sm text-gray-600">Active Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{patients.filter(p => p.nextAppointment).length}</p>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
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
                <p className="text-2xl font-bold">{patients.reduce((sum, p) => sum + p.totalVisits, 0)}</p>
                <p className="text-sm text-gray-600">Total Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>My Patients</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">No patients match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {/* Patient Avatar */}
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-teal-600">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(patient.status)}`}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {patient.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Age:</span>
                          <span className="ml-1">{patient.age} ({patient.gender})</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Condition:</span>
                          <span className="ml-1">{patient.condition}</span>
                        </div>
                        <div>
                          <span className="font-medium">Blood Type:</span>
                          <span className="ml-1">{patient.bloodType}</span>
                        </div>
                        <div>
                          <span className="font-medium">Total Visits:</span>
                          <span className="ml-1">{patient.totalVisits}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                        <div>
                          <span className="font-medium">Last Visit:</span>
                          <span className="ml-1">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="font-medium">Next Appointment:</span>
                          <span className="ml-1">
                            {patient.nextAppointment 
                              ? new Date(patient.nextAppointment).toLocaleDateString()
                              : "Not scheduled"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(patient.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View patient details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewRecords(patient.id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View medical records"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditPatient(patient.id)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Edit patient"
                    >
                      <Edit className="w-4 h-4" />
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
