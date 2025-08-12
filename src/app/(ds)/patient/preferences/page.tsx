/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api';
import { Bell, MessageSquare, ShieldCheck } from 'lucide-react';

export default function PreferencesPage() {
  const { user } = useAuthHooks();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const response = await api.get('/patient/preferences');
        setPreferences(response?.data?.data ?? null);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch preferences');
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  if (!user) return null;

  const BRAND = '#C4E1E1';
  const method = preferences?.preferredCommunicationMethod
    ? String(preferences.preferredCommunicationMethod).toLowerCase()
    : '';

  const pill = (text: string) => (
    <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-800 ring-1 ring-black/10">
      {text}
    </span>
  );

  return (
    <div
      className="p-6"
  
      style={{ ['--brand']: BRAND }}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-5xl rounded-full"
        style={{ background:'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)' }}
        aria-hidden
      />

      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Preferences</h1>
          <p className="mt-1 text-gray-600">
            Manage your preferences, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
          </p>
        </header>

        {/* Alerts */}
        {loading && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-800">Loading…</div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">{error}</div>
        )}

        {/* Summary card */}
        <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Your Current Settings</h2>
            <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand)]/40 px-2 py-1 text-xs text-gray-800 ring-1 ring-[var(--brand)]/60">
              <ShieldCheck className="h-3.5 w-3.5" /> Saved
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-5 w-64 animate-pulse rounded bg-gray-200/70" />
              <div className="h-5 w-56 animate-pulse rounded bg-gray-200/70" />
              <div className="h-28 animate-pulse rounded-xl border border-black/5 bg-gray-100/60" />
            </div>
          ) : !preferences ? (
            <div className="rounded-xl border border-black/5 bg-white/70 p-8 text-center text-gray-600">
              No preferences found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-black/5 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-900">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Preferred Communication</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pill(prettyMethod(method))}
                </div>
              </div>

              <div className="rounded-xl border border-black/5 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-gray-900">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Appointment Reminder Timing</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pill(`${preferences.appointmentReminderTiming} hour${Number(preferences.appointmentReminderTiming) === 1 ? '' : 's'} before`)}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Preview / future form (disabled to avoid changing functionality) */}
        <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-gray-900">Update Preferences</h3>
            <p className="text-xs text-gray-500">Form is read-only for now. Wire it to <code className="rounded bg-gray-100 px-1 py-0.5">PUT /patient/preferences</code> later.</p>
          </div>

          <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Preferred Communication</span>
              <select
                disabled
                defaultValue={method || 'email'}
                className="h-11 w-full cursor-not-allowed rounded-xl border border-black/10 bg-gray-100 px-3 text-gray-500 outline-none"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="call">Phone Call</option>
                <option value="in-app">In-app</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Reminder Timing (hours before)</span>
              <input
                disabled
                type="number"
                min={0}
                defaultValue={preferences?.appointmentReminderTiming ?? 24}
                className="h-11 w-full cursor-not-allowed rounded-xl border border-black/10 bg-gray-100 px-3 text-gray-500 outline-none"
              />
            </label>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                disabled
                className="rounded-xl bg-[var(--brand)]/60 px-4 py-2.5 font-medium text-gray-900 ring-1 ring-[var(--brand)]/60 opacity-60"
                title="Coming soon"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function prettyMethod(m: string) {
  switch (m) {
    case 'sms': return 'SMS';
    case 'email': return 'Email';
    case 'call': return 'Phone Call';
    case 'in-app':
    case 'inapp':
    case 'in_app': return 'In-app';
    default: return m ? m.charAt(0).toUpperCase() + m.slice(1) : '—';
  }
}
