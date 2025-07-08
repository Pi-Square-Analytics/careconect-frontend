"use client";

import { useState } from "react";
import { Calendar, Clock, User, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    reason: "",
    notes: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const doctors = [
    { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiology", avatar: "SJ" },
    { id: "2", name: "Dr. Michael Chen", specialty: "Dermatology", avatar: "MC" },
    { id: "3", name: "Dr. Emily Davis", specialty: "Pediatrics", avatar: "ED" },
    { id: "4", name: "Dr. Robert Wilson", specialty: "Orthopedics", avatar: "RW" },
  ];

  const specialties = [
    "Cardiology",
    "Dermatology", 
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "General Medicine"
  ];

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Appointment booked successfully!");
      // Reset form
      setFormData({
        doctor: "",
        specialty: "",
        date: "",
        time: "",
        reason: "",
        notes: ""
      });
    } catch (error) {
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600">Schedule your next medical consultation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Form */}
        <div className="lg:col-span-2">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Specialty Selection */}
                <div>
                  <Label htmlFor="specialty">Medical Specialty</Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleChange('specialty', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor Selection */}
                <div>
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select value={formData.doctor} onValueChange={(value) => handleChange('doctor', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors
                        .filter(doctor => !formData.specialty || doctor.specialty === formData.specialty)
                        .map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="mt-1 input-field"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select value={formData.time} onValueChange={(value) => handleChange('time', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    type="text"
                    value={formData.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    className="mt-1 input-field"
                    placeholder="Brief description of your concern"
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="mt-1 input-field min-h-[100px] resize-none"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Booking Appointment...' : 'Book Appointment'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Doctors */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Available Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-teal-600">{doctor.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>appointments@careconnect.com</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
                  <span>123 Healthcare Ave<br />Medical City, MC 12345</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
