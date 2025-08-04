/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    dateOfBirth: "",
    bio: "",
    specialization: "", // For doctors
    experience: "", // For doctors
    department: "", // For admin/doctors
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Set form data with mock data based on role
      const mockData = getMockUserData(parsedUser.role, parsedUser.name, parsedUser.email);
      setFormData(mockData);
    }
  }, []);

  const getMockUserData = (role: string, name: string, email: string) => {
    const baseData = {
      name: name || "John Doe",
      email: email || "john.doe@careconnect.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      dateOfBirth: "1985-06-15",
      bio: "",
      specialization: "",
      experience: "",
      department: "",
    };

    switch (role) {
      case "doctor":
        return {
          ...baseData,
          bio: "Dedicated healthcare professional with a passion for patient care and medical excellence.",
          specialization: "Cardiology",
          experience: "15 years",
          department: "Cardiovascular Medicine",
        };
      case "admin":
        return {
          ...baseData,
          bio: "Healthcare administrator focused on improving patient experience and operational efficiency.",
          department: "Healthcare Administration",
          specialization: "",
          experience: "",
        };
      case "patient":
        return {
          ...baseData,
          bio: "Health-conscious individual committed to maintaining wellness and preventive care.",
          specialization: "",
          experience: "",
          department: "",
        };
      default:
        return baseData;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information and settings</p>
        </div>
        
        {!isEditing ? (
          <button onClick={handleEdit} className="mt-4 sm:mt-0 btn-primary flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button onClick={handleSave} className="btn-primary flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary flex items-center">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <Card className="dashboard-card">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="" alt={formData.name} />
                <AvatarFallback className="bg-teal-600 text-white text-2xl">
                  {formData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{formData.name}</h3>
              <p className="text-gray-600 mb-2 capitalize">{user.role}</p>
              
              {user.role === "doctor" && formData.specialization && (
                <p className="text-sm text-teal-600 font-medium">{formData.specialization}</p>
              )}
              
              {isEditing && (
                <button className="mt-4 btn-secondary text-sm">
                  Change Photo
                </button>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="dashboard-card mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.role === "doctor" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{formData.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department</span>
                      <span className="font-medium">{formData.department}</span>
                    </div>
                  </>
                )}
                
                {user.role === "admin" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium">{formData.department}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="mt-1 input-field"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="mt-1 input-field"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="mt-1 input-field"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="mt-1 input-field"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.location}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="mt-1 input-field"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {new Date(formData.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                {/* Professional Information (for doctors and admin) */}
                {(user.role === "doctor" || user.role === "admin") && (
                  <>
                    <hr className="my-6" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                    
                    {user.role === "doctor" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="specialization">Specialization</Label>
                          {isEditing ? (
                            <Input
                              id="specialization"
                              value={formData.specialization}
                              onChange={(e) => handleChange('specialization', e.target.value)}
                              className="mt-1 input-field"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{formData.specialization}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="experience">Years of Experience</Label>
                          {isEditing ? (
                            <Input
                              id="experience"
                              value={formData.experience}
                              onChange={(e) => handleChange('experience', e.target.value)}
                              className="mt-1 input-field"
                            />
                          ) : (
                            <p className="mt-1 text-gray-900">{formData.experience}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => handleChange('department', e.target.value)}
                          className="mt-1 input-field"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{formData.department}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="mt-1 input-field min-h-[100px] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{formData.bio || "No bio provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
