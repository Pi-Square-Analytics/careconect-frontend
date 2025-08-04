"use client";

import { useState } from "react";
import { FileText, Search, Filter, Calendar, User, Clock, Download, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConsultationRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const consultationRecords = [
    {
      id: "1",
      patientName: "John Doe",
      patientId: "P001",
      date: "2024-12-10",
      time: "09:00 AM",
      type: "Consultation",
      duration: 30,
      diagnosis: "Hypertension",
      symptoms: "Chest pain, shortness of breath",
      treatment: "Prescribed Lisinopril 10mg daily",
      notes: "Patient responding well to treatment. Blood pressure stable.",
      followUp: "2024-12-24",
      status: "completed"
    },
    {
      id: "2",
      patientName: "Jane Smith",
      patientId: "P002",
      date: "2024-12-08",
      time: "10:30 AM",
      type: "Follow-up",
      duration: 20,
      diagnosis: "Diabetes Type 2",
      symptoms: "Fatigue, increased thirst",
      treatment: "Adjusted Metformin dosage to 1000mg twice daily",
      notes: "HbA1c levels improving. Continue current medication regimen.",
      followUp: "2025-01-08",
      status: "completed"
    },
    {
      id: "3",
      patientName: "Bob Wilson",
      patientId: "P003",
      date: "2024-12-05",
      time: "02:00 PM",
      type: "Initial Consultation",
      duration: 45,
      diagnosis: "Anxiety Disorder",
      symptoms: "Panic attacks, sleep disturbances",
      treatment: "Prescribed Sertraline 50mg daily, referred to therapist",
      notes: "First-time patient. Detailed history taken. Recommend therapy alongside medication.",
      followUp: "2024-12-19",
      status: "completed"
    },
    {
      id: "4",
      patientName: "Alice Brown",
      patientId: "P004",
      date: "2024-12-03",
      time: "11:00 AM",
      type: "Procedure",
      duration: 60,
      diagnosis: "Arthritis",
      symptoms: "Joint pain, stiffness",
      treatment: "Cortisone injection in knee joint",
      notes: "Procedure completed successfully. Patient tolerated well.",
      followUp: "2024-12-17",
      status: "completed"
    },
    {
      id: "5",
      patientName: "Charlie Davis",
      patientId: "P005",
      date: "2024-12-12",
      time: "03:30 PM",
      type: "Emergency",
      duration: 90,
      diagnosis: "Severe Migraine",
      symptoms: "Severe headache, nausea, light sensitivity",
      treatment: "IV fluids, Sumatriptan injection",
      notes: "Emergency consultation. Patient stabilized and discharged.",
      followUp: "2024-12-26",
      status: "completed"
    }
  ];

  const filteredRecords = consultationRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || record.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesDate = !dateFilter || record.date === dateFilter;
    return matchesSearch && matchesType && matchesDate;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Consultation":
        return "bg-blue-100 text-blue-800";
      case "Follow-up":
        return "bg-green-100 text-green-800";
      case "Initial Consultation":
        return "bg-purple-100 text-purple-800";
      case "Procedure":
        return "bg-orange-100 text-orange-800";
      case "Emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewRecord = (recordId: string) => {
    alert(`View consultation record ${recordId}`);
  };

  const handleEditRecord = (recordId: string) => {
    alert(`Edit consultation record ${recordId}`);
  };

  const handleDownloadRecord = (recordId: string) => {
    alert(`Download consultation record ${recordId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Consultation Records</h1>
        <p className="text-gray-600">View and manage patient consultation records</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by patient name, diagnosis, or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="follow-up">Follow-up</SelectItem>
            <SelectItem value="initial">Initial Consultation</SelectItem>
            <SelectItem value="procedure">Procedure</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
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
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{consultationRecords.length}</p>
                <p className="text-sm text-gray-600">Total Records</p>
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
                <p className="text-2xl font-bold">
                  {consultationRecords.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
                </p>
                <p className="text-sm text-gray-600">Today&apos;s Records</p>
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
                <p className="text-2xl font-bold">
                  {new Set(consultationRecords.map(r => r.patientId)).size}
                </p>
                <p className="text-sm text-gray-600">Unique Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(consultationRecords.reduce((sum, r) => sum + r.duration, 0) / consultationRecords.length)}
                </p>
                <p className="text-sm text-gray-600">Avg Duration (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Consultation Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">No consultation records match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Record Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {/* Patient Avatar */}
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-teal-600" />
                        </div>
                        
                        {/* Patient & Record Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{record.patientName}</h3>
                            <span className="text-sm text-gray-500">({record.patientId})</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                              {record.type}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(record.date).toLocaleDateString()} at {record.time}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {record.duration} minutes
                            </div>
                            <div>
                              <span className="font-medium">Diagnosis:</span>
                              <span className="ml-1">{record.diagnosis}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Consultation Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Symptoms</p>
                          <p className="text-sm text-gray-600">{record.symptoms}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Treatment</p>
                          <p className="text-sm text-gray-600">{record.treatment}</p>
                        </div>
                      </div>
                      
                      {/* Notes */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{record.notes}</p>
                      </div>
                      
                      {/* Follow-up */}
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Follow-up Scheduled</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.followUp).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                      <button
                        onClick={() => handleViewRecord(record.id)}
                        className="btn-secondary text-sm flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditRecord(record.id)}
                        className="btn-secondary text-sm flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDownloadRecord(record.id)}
                        className="btn-secondary text-sm flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
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
