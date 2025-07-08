"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent} from "@/components/ui/Card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    nationalId: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    location: '',
    role: 'patient',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
    emergencyContactEmail: '',
    typeOfDisability: '',
    bloodGroup: '',
    knownAllergies: '',
    chronicalCondition: '',
    vaccinationStatus: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in localStorage (replace with proper auth)
      const user = {
        name: formData.fullname,
        email: formData.email,
        role: formData.role,
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      switch (formData.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'doctor':
          router.push('/dashboard/doctor');
          break;
        case 'patient':
          router.push('/dashboard/patient');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Image */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <img
          src="/assets/Register.png"
          alt="Hero Image"
          className="max-w-full h-96 rounded-lg shadow-lg"
        />
      </div>

      {/* Right Section - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full py-8">
          {/* Header */}
          <div className=" mb-8">
            {/* <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">CareConnect</span>
            </div> */}
            <h2 className="text-3xl font-bold text-gray-900">Sign up</h2>
            <p className="text-gray-600 mt-2">Let’s get you all st up so you can access your personal account.</p>
          </div>

          {/* Registration Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullname">Full Name *</Label>
                      <Input
                        id="fullname"
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => handleChange('fullname', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nationalId">National ID *</Label>
                      <Input
                        id="nationalId"
                        type="text"
                        value={formData.nationalId}
                        onChange={(e) => handleChange('nationalId', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter your national ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        className="mt-1 input-field"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter your location"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Emergency Contact</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactNumber">Emergency Contact Number *</Label>
                      <Input
                        id="emergencyContactNumber"
                        type="tel"
                        value={formData.emergencyContactNumber}
                        onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter emergency contact number"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyContactRelation">Relation *</Label>
                      <Select value={formData.emergencyContactRelation} onValueChange={(value) => handleChange('emergencyContactRelation', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emergencyContactEmail">Emergency Contact Email</Label>
                    <Input
                      id="emergencyContactEmail"
                      type="email"
                      value={formData.emergencyContactEmail}
                      onChange={(e) => handleChange('emergencyContactEmail', e.target.value)}
                      className="mt-1 input-field"
                      placeholder="Enter emergency contact email"
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Medical Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="typeOfDisability">Type of Disability</Label>
                      <Input
                        id="typeOfDisability"
                        type="text"
                        value={formData.typeOfDisability}
                        onChange={(e) => handleChange('typeOfDisability', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter type of disability (if any)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select value={formData.bloodGroup} onValueChange={(value) => handleChange('bloodGroup', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="knownAllergies">Known Allergies</Label>
                      <Input
                        id="knownAllergies"
                        type="text"
                        value={formData.knownAllergies}
                        onChange={(e) => handleChange('knownAllergies', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter known allergies"
                      />
                    </div>

                    <div>
                      <Label htmlFor="chronicalCondition">Chronical Condition</Label>
                      <Input
                        id="chronicalCondition"
                        type="text"
                        value={formData.chronicalCondition}
                        onChange={(e) => handleChange('chronicalCondition', e.target.value)}
                        className="mt-1 input-field"
                        placeholder="Enter chronical conditions"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vaccinationStatus">Vaccination Status</Label>
                    <Select value={formData.vaccinationStatus} onValueChange={(value) => handleChange('vaccinationStatus', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select vaccination status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully-vaccinated">Fully Vaccinated</SelectItem>
                        <SelectItem value="partially-vaccinated">Partially Vaccinated</SelectItem>
                        <SelectItem value="not-vaccinated">Not Vaccinated</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Security</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          className="input-field pr-10"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          className="input-field pr-10"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleChange('agreeTerms', checked as boolean)}
                  />
                  <Label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-teal-600 hover:text-teal-500">
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-teal-600 hover:text-teal-500 font-medium">
                      Login
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
