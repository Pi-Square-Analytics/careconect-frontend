"use client";

import { useState } from "react";
import { User, Plus, Search, Filter, Mail, Phone, MapPin, Edit, Trash2, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      email: "sarah.johnson@careconnect.com",
      phone: "+1 (555) 123-4567",
      location: "Main Building, Floor 2",
      status: "active",
      patients: 156,
      experience: "15 years",
      joinDate: "2020-01-15"
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      email: "michael.chen@careconnect.com",
      phone: "+1 (555) 234-5678",
      location: "Dermatology Wing, Floor 1",
      status: "active",
      patients: 89,
      experience: "8 years",
      joinDate: "2021-03-20"
    },
    {
      id: "3",
      name: "Dr. Emily Davis",
      specialty: "Pediatrics",
      email: "emily.davis@careconnect.com",
      phone: "+1 (555) 345-6789",
      location: "Pediatric Center, Floor 3",
      status: "active",
      patients: 203,
      experience: "12 years",
      joinDate: "2019-08-10"
    },
    {
      id: "4",
      name: "Dr. Robert Wilson",
      specialty: "Orthopedics",
      email: "robert.wilson@careconnect.com",
      phone: "+1 (555) 456-7890",
      location: "Orthopedic Clinic, Floor 1",
      status: "inactive",
      patients: 67,
      experience: "20 years",
      joinDate: "2018-05-05"
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || doctor.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "status-confirmed";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "status-pending";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (doctorId: string) => {
    alert(`Edit doctor ${doctorId}`);
  };

  const handleDelete = (doctorId: string) => {
    if (confirm("Are you sure you want to remove this doctor?")) {
      alert(`Delete doctor ${doctorId}`);
    }
  };

  const handleAddDoctor = () => {
    alert("Add new doctor");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-600">Add, edit, and manage healthcare professionals</p>
        </div>
        
        <button onClick={handleAddDoctor} className="mt-4 sm:mt-0 btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Doctors</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.filter(d => d.status === "active").length}</p>
                <p className="text-sm text-gray-600">Active Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.filter(d => d.status === "inactive").length}</p>
                <p className="text-sm text-gray-600">Inactive</p>
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
                <p className="text-2xl font-bold">{doctors.reduce((sum, d) => sum + d.patients, 0)}</p>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{doctors.length}</p>
                <p className="text-sm text-gray-600">Total Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors List */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Healthcare Professionals</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">No doctors match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-teal-600">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(doctor.status)}`}>
                          {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{doctor.specialty} • {doctor.experience} experience</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {doctor.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {doctor.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {doctor.location}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">{doctor.patients} patients</span> • 
                        <span className="ml-1">Joined {new Date(doctor.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(doctor.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit doctor"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove doctor"
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
