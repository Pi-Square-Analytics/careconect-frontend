/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import  api  from '@/lib/api/api';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { Cog, RefreshCcw, Save, Wrench, Info } from 'lucide-react';

type Settings = {
  appName: string;
  supportEmail: string;
  timezone: string;
  sessionTimeoutMins: number;

  systemMaintenance: boolean;
  maintenanceMessage: string;

  allowSelfSignup: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;

  version?: string;
  updatedAt?: string;
};

const BRAND = '#C4E1E1';

// Dummy fallback (used when API isn’t ready)
const fallbackSettings: Settings = {
  appName: 'CareFlow',
  supportEmail: 'support@example.com',
  timezone: 'Africa/Kigali',
  sessionTimeoutMins: 30,

  systemMaintenance: false,
  maintenanceMessage: 'We are currently undergoing maintenance. Please try again later.',

  allowSelfSignup: true,
  emailNotifications: true,
  smsNotifications: false,

  version: '0.9.0',
  updatedAt: new Date().toISOString(),
};

export default function SettingsPage() {
  const { user } = useAuthHooks();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Settings | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      setNotice(null);
      try {
        const res = await api.get('/misc/configuration');
        const data = (res?.data?.data || res?.data) as Partial<Settings> | undefined;

        // Merge into fallback to ensure all fields exist
        const merged = { ...fallbackSettings, ...(data ?? {}) };
        setSettings(merged);
        setForm(merged);
        if (!data) {
          setNotice('Using demo settings (API not returning data yet).');
        }
      } catch (err: any) {
        setSettings(fallbackSettings);
        setForm(fallbackSettings);
        setNotice('API unavailable. Showing demo settings.');
        setError((err as any)?.response?.data?.message || null);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const dirty = useMemo(() => {
    if (!settings || !form) return false;
    return JSON.stringify(settings) !== JSON.stringify(form);
  }, [settings, form]);

  const onChange = (key: keyof Settings, value: any) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const onSave = async () => {
    if (!form) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      // Try real API
      const res = await api.patch('/admin/settings', form);
      const updated = (res?.data?.data || res?.data || form) as Settings;
      setSettings(updated);
      setForm(updated);
      setNotice('Settings saved successfully.');
    } catch {
      // Simulate success if API not ready
      await new Promise((r) => setTimeout(r, 700));
      setSettings(form);
      setNotice('Settings saved locally (demo mode).');
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 2500);
    }
  };

  const onReset = () => {
    if (!settings) return;
    setForm(settings);
  };

  if (!user) return null;

  return (
    <div
      className="p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-6xl rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)',
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight text-gray-900">
              <span
                className="grid h-9 w-9 place-items-center rounded-lg ring-1 ring-black/5"
                style={{ background: 'var(--brand)' }}
              >
                <Cog className="h-5 w-5 text-black/70" />
              </span>
              Settings
            </h1>
            <p className="mt-1 text-gray-600">
              Manage system settings, <span className="font-medium">{user.profile.firstName} {user.profile.lastName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              disabled={!dirty || !form}
              className="rounded-xl border-black/10"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={!dirty || saving || !form}
              className="rounded-xl bg-[var(--brand)]/80 text-gray-900 hover:bg-[var(--brand)] disabled:opacity-60"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </header>

        {/* Alerts */}
        {(loading || notice || error) && (
          <div className="space-y-3">
            {loading && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700" role="status">
                Loading settings…
              </div>
            )}
            {notice && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
                <Info className="mt-0.5 h-4 w-4" />
                <span>{notice}</span>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {!form ? (
          <Skeleton />
        ) : (
          <>
            {/* General */}
            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-800">General</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field label="Application Name">
                  <Input
                    value={form.appName}
                    onChange={(e) => onChange('appName', e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </Field>
                <Field label="Support Email">
                  <Input
                    type="email"
                    value={form.supportEmail}
                    onChange={(e) => onChange('supportEmail', e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </Field>
                <Field label="Timezone">
                  <Select
                    value={form.timezone}
                    onValueChange={(v) => onChange('timezone', v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* keep short list; you can extend later */}
                      <SelectItem value="Africa/Kigali">Africa/Kigali</SelectItem>
                      <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Session Timeout (minutes)">
                  <Input
                    type="number"
                    min={5}
                    value={form.sessionTimeoutMins}
                    onChange={(e) => onChange('sessionTimeoutMins', Number(e.target.value))}
                    className="h-11 rounded-xl"
                  />
                </Field>
              </CardContent>
            </Card>

            {/* Access & Notifications */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Access</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <ToggleRow
                    label="Allow Self Signup"
                    description="Enable users to create their own accounts."
                    checked={form.allowSelfSignup}
                    onCheckedChange={(v) => onChange('allowSelfSignup', v)}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">Notifications</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <ToggleRow
                    label="Email Notifications"
                    description="Send important updates to user email."
                    checked={form.emailNotifications}
                    onCheckedChange={(v) => onChange('emailNotifications', v)}
                  />
                  <ToggleRow
                    label="SMS Notifications"
                    description="Send SMS alerts for time-sensitive events."
                    checked={form.smsNotifications}
                    onCheckedChange={(v) => onChange('smsNotifications', v)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Maintenance */}
            <Card className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                  <Wrench className="h-4 w-4" /> Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <ToggleRow
                  label="System Maintenance Mode"
                  description="Temporarily disable access for end users while performing updates."
                  checked={form.systemMaintenance}
                  onCheckedChange={(v) => onChange('systemMaintenance', v)}
                />
                <Field label="Maintenance Message">
                  <Textarea
                    rows={3}
                    value={form.maintenanceMessage}
                    onChange={(e) => onChange('maintenanceMessage', e.target.value)}
                    className="rounded-xl"
                  />
                </Field>

                <div className="grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                  <div>
                    <span className="font-medium text-gray-700">Version:</span>{' '}
                    {form.version ?? '—'}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>{' '}
                    {form.updatedAt ? new Date(form.updatedAt).toLocaleString() : '—'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Row (secondary) */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={!dirty || !form}
                className="rounded-xl border-black/10"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="button"
                onClick={onSave}
                disabled={!dirty || saving || !form}
                className="rounded-xl bg-[var(--brand)]/80 text-gray-900 hover:bg-[var(--brand)] disabled:opacity-60"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="grid gap-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {children}
  </label>
);

const ToggleRow = ({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-black/5 bg-white/70 p-4">
    <div>
      <div className="text-sm font-medium text-gray-800">{label}</div>
      {description && <div className="mt-0.5 text-xs text-gray-500">{description}</div>}
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

const Skeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="pb-2">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200/70" />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200/60" />
        </CardContent>
      </Card>
    ))}
  </div>
);
