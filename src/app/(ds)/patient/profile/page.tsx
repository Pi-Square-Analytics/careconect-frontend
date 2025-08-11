/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api'; 

interface Profile {
  userId: string;
  email: string;
  phoneNumber: string;
  userType: 'patient' | 'admin' | 'doctor';
  accountStatus: 'active' | 'inactive' | 'pending';
  emailVerified: boolean | null;
  phoneVerified: boolean | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
}

interface UpdateProfile {
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
  phoneNumber?: string;
}

export default function ProfilePage() {
  const { user } = useAuthHooks();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [updateData, setUpdateData] = useState<UpdateProfile>({
    profile: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      address: '',
    },
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/users/profile');
        let fetchedProfile: Profile | null = null;
        
        if (response.data) {
          if (response.data.data) {
            fetchedProfile = response.data.data;
          } else if (response.data.userId || response.data.email) {
            fetchedProfile = response.data;
          }
        }
        
        if (fetchedProfile) {
          setProfile(fetchedProfile);
          setUpdateData({
            profile: {
              firstName: fetchedProfile.profile?.firstName || '',
              lastName: fetchedProfile.profile?.lastName || '',
              dateOfBirth: fetchedProfile.profile?.dateOfBirth || '',
              gender: fetchedProfile.profile?.gender || '',
              address: fetchedProfile.profile?.address || '',
            },
            phoneNumber: fetchedProfile.phoneNumber || '',
          });
        } else {
          setError('Invalid profile data received');
        }
      } catch (err: any) {
        let errorMessage = 'Failed to fetch profile';
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.put('/users/profile', updateData);
      let updatedProfile: Profile | null = null;
      
      if (response.data) {
        if (response.data.data) {
          updatedProfile = response.data.data;
        } else if (response.data.userId || response.data.email) {
          updatedProfile = response.data;
        }
      }
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      let errorMessage = 'Failed to update profile';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      setUpdateData({ ...updateData, phoneNumber: value });
    } else {
      setUpdateData({
        ...updateData,
        profile: {
          ...updateData.profile,
          [name]: value,
        },
      });
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setUpdateData({
        profile: {
          firstName: profile.profile?.firstName || '',
          lastName: profile.profile?.lastName || '',
          dateOfBirth: profile.profile?.dateOfBirth || '',
          gender: profile.profile?.gender || '',
          address: profile.profile?.address || '',
        },
        phoneNumber: profile.phoneNumber || '',
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b bg-[#C4E1E1] text-gray-900">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="opacity-90 mt-1">
            Welcome, {user.profile.firstName} {user.profile.lastName}!
          </p>
        </div>

        <div className="p-8">
          {loading && <p className="text-center text-[#C4E1E1]">Loading profile...</p>}
          {error && <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

          {profile && !isEditing ? (
            <div className="space-y-8">
              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  <Info label="First Name" value={profile.profile?.firstName} />
                  <Info label="Last Name" value={profile.profile?.lastName} />
                  <Info label="Date of Birth" value={profile.profile?.dateOfBirth ? new Date(profile.profile.dateOfBirth).toLocaleDateString() : null} />
                  <Info label="Gender" value={profile.profile?.gender} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
                  <Info label="Email" value={profile.email} badge={profile.emailVerified} />
                  <Info label="Phone Number" value={profile.phoneNumber} badge={profile.phoneVerified} />
                  <Info label="User Type" value={profile.userType} />
                  <Info label="Account Status" value={profile.accountStatus} status />
                </div>
              </div>

              <Info label="Address" value={profile.profile?.address} />
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-4">
                <div><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</div>
                <div><strong>Last login:</strong> {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'}</div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#C4E1E1] text-gray-900 px-5 py-2 rounded-lg shadow hover:bg-[#a7caca] transition-all"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : profile && isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Edit Profile</h3>
              {/* Inputs */}
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="First Name" name="firstName" value={updateData.profile.firstName} onChange={handleInputChange} required />
                <Input label="Last Name" name="lastName" value={updateData.profile.lastName} onChange={handleInputChange} required />
                <Input type="date" label="Date of Birth" name="dateOfBirth" value={updateData.profile.dateOfBirth} onChange={handleInputChange} />
                <Select label="Gender" name="gender" value={updateData.profile.gender} onChange={handleInputChange} options={['male', 'female', 'other']} />
                <Input type="tel" label="Phone Number" name="phoneNumber" value={updateData.phoneNumber} onChange={handleInputChange} />
              </div>
              <Textarea label="Address" name="address" value={updateData.profile.address} onChange={handleInputChange} rows={3} />
              <div className="flex gap-4">
                <button type="submit" disabled={updating} className="bg-[#C4E1E1] text-gray-900 px-5 py-2 rounded-lg shadow hover:bg-[#a7caca] disabled:bg-gray-400">
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* Small UI helpers */
const Info = ({ label, value, badge, status }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    <p className="mt-1 text-gray-900 capitalize">{value || 'Not provided'}</p>
    {badge !== undefined && (
      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${badge ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {badge ? 'Verified' : 'Not Verified'}
      </span>
    )}
    {status && (
      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded capitalize ${
        value === 'active' ? 'bg-green-100 text-green-800' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input {...props} className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#C4E1E1] focus:border-[#C4E1E1]" />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select {...props} className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#C4E1E1] focus:border-[#C4E1E1]">
      <option value="">Select</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea {...props} className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#C4E1E1] focus:border-[#C4E1E1]" />
  </div>
);
