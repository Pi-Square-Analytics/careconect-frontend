/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
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

const BRAND = '#C4E1E1';

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
        if (typeof err === 'string') errorMessage = err;
        else if (err?.response?.data?.message) errorMessage = err.response.data.message;
        else if (err?.message) errorMessage = err.message;
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
      if (typeof err === 'string') errorMessage = err;
      else if (err?.response?.data?.message) errorMessage = err.response.data.message;
      else if (err?.message) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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

  const initials = useMemo(() => {
    const f = profile?.profile?.firstName?.[0] ?? '';
    const l = profile?.profile?.lastName?.[0] ?? '';
    return (f + l || 'U').toUpperCase();
  }, [profile]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-5xl rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-5xl">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl">
          <div
            className="px-8 py-6"
            style={{
              background:
                'linear-gradient(180deg, rgba(196,225,225,0.35) 0%, rgba(255,255,255,0.9) 100%)',
            }}
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 place-items-center rounded-xl text-lg font-semibold text-gray-800 ring-1 ring-black/5"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 30%, var(--brand), #ffffff 70%)',
                  }}
                  aria-hidden
                >
                  {initials}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold leading-tight text-gray-900">Profile</h1>
                  <p className="text-sm text-gray-600">
                    Welcome, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl bg-[var(--brand)]/80 px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-[var(--brand)]"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="profile-edit-form"
                      disabled={updating}
                      className="rounded-xl bg-[var(--brand)]/80 px-4 py-2 text-sm font-medium text-gray-900 shadow hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updating ? 'Saving…' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notices */}
          {(loading || error || success) && (
            <div className="space-y-3 px-8 pb-6 pt-4">
              {loading && (
                <div
                  role="status"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                  Loading profile…
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {success}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6">
          {profile && !isEditing ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Personal */}
              <SectionCard title="Personal Information">
                <Info label="First Name" value={profile.profile?.firstName} />
                <Info label="Last Name" value={profile.profile?.lastName} />
                <Info
                  label="Date of Birth"
                  value={
                    profile.profile?.dateOfBirth
                      ? new Date(profile.profile.dateOfBirth).toLocaleDateString()
                      : null
                  }
                />
                <Info label="Gender" value={profile.profile?.gender} />
              </SectionCard>

              {/* Contact / Account */}
              <SectionCard title="Contact & Account">
                <Info label="Email" value={profile.email} badge={profile.emailVerified} />
                <Info label="Phone Number" value={profile.phoneNumber} badge={profile.phoneVerified} />
                <Info label="User Type" value={profile.userType} />
                <Info label="Account Status" value={profile.accountStatus} status />
              </SectionCard>

              {/* Address */}
              <SectionCard title="Address" className="lg:col-span-2">
                <Info label="Street Address" value={profile.profile?.address} />
              </SectionCard>

              {/* Meta */}
              <SectionCard title="Security & Activity" className="lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-600">
                  <div>
                    <span className="block text-gray-500">Member since</span>
                    <span className="mt-1 block font-medium text-gray-900">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Last login</span>
                    <span className="mt-1 block font-medium text-gray-900">
                      {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Never'}
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>
          ) : profile && isEditing ? (
            <form id="profile-edit-form" onSubmit={handleUpdateProfile} className="space-y-6">
              <SectionCard title="Edit Profile">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="First Name" name="firstName" value={updateData.profile.firstName} onChange={handleInputChange} required />
                  <Input label="Last Name" name="lastName" value={updateData.profile.lastName} onChange={handleInputChange} required />
                  <Input type="date" label="Date of Birth" name="dateOfBirth" value={updateData.profile.dateOfBirth} onChange={handleInputChange} />
                  <Select label="Gender" name="gender" value={updateData.profile.gender} onChange={handleInputChange} options={['male', 'female', 'other']} />
                  <Input type="tel" label="Phone Number" name="phoneNumber" value={updateData.phoneNumber} onChange={handleInputChange} />
                </div>
                <Textarea label="Address" name="address" value={updateData.profile.address} onChange={handleInputChange} rows={3} />
              </SectionCard>

              {/* action row duplicated up top for convenience */}
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-[var(--brand)]/80 px-5 py-2 text-sm font-medium text-gray-900 shadow hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? 'Updating…' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ---------- UI atoms (kept simple, no functionality changes) ---------- */

const SectionCard = ({
  title,
  children,
  className = '',
}: { title: string; children: any; className?: string }) => (
  <section className={`rounded-2xl border border-black/5 bg-white/80 p-6 shadow-xl backdrop-blur ${className}`}>
    <header className="mb-4">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </header>
    <div className="grid gap-4">{children}</div>
  </section>
);

const Info = ({ label, value, badge, status }: any) => (
  <div>
    <label className="block text-xs font-medium uppercase tracking-wide text-gray-500">{label}</label>
    <p className="mt-1 text-[15px] font-medium text-gray-900">{value || 'Not provided'}</p>

    {badge !== undefined && (
      <span
        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ${
          badge
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            : 'bg-amber-50 text-amber-700 ring-amber-200'
        }`}
      >
        <Dot ok={!!badge} />
        {badge ? 'Verified' : 'Not verified'}
      </span>
    )}

    {status && (
      <span
        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs capitalize ring-1 ${
          value === 'active'
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
            : value === 'pending'
            ? 'bg-amber-50 text-amber-700 ring-amber-200'
            : 'bg-rose-50 text-rose-700 ring-rose-200'
        }`}
      >
        <Dot ok={value === 'active'} />
        {value}
      </span>
    )}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="mt-1 h-11 w-full rounded-xl border border-gray-300 bg-white px-3 shadow-sm outline-none ring-0 transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      {...props}
      className="mt-1 h-11 w-full rounded-xl border border-gray-300 bg-white px-3 shadow-sm outline-none ring-0 transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
    >
      <option value="">Select</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt} className="capitalize">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 shadow-sm outline-none ring-0 transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
    />
  </div>
);

const Dot = ({ ok }: { ok: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" className="inline-block">
    <circle cx="5" cy="5" r="4" className={ok ? 'fill-emerald-500' : 'fill-amber-500'} />
  </svg>
);
