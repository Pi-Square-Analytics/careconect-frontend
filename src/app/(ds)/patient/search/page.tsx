'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuthHooks } from '@/hooks/useAuth';
import api from '@/lib/api/api';
import { 
  Search, 
  Stethoscope, 
  MapPin, 
  Star, 
  Calendar, 
  Filter,
  RefreshCcw,
  User as UserIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Doctor {
  doctorId: string;
  specialty: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

const BRAND = '#C4E1E1';

export default function SearchDoctorsPage() {
  const { user } = useAuthHooks();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/search/doctors');
        setDoctors(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch doctors';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = useMemo(() => {
    const s = new Set(doctors.map(d => d.specialty));
    return ['All', ...Array.from(s)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const name = `${d.profile?.firstName} ${d.profile?.lastName}`.toLowerCase();
      const matchSearch = name.includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpecialty = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
      return matchSearch && matchSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  if (!user) return null;

  return (
    <div className="p-6" style={{ '--brand': BRAND } as React.CSSProperties}>
      {/* brand ribbon */}
      <div
        className="mx-auto mb-6 h-1 max-w-6xl rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--brand) 20%, var(--brand) 80%, transparent 100%)' }}
        aria-hidden
      />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/20 border border-[var(--brand)]/30 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Find Excellence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Find Your <span className="text-[#8ab6b6]">Specialist</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with top-rated medical professionals across various specialties. Your health journey, simplified.
          </p>
        </div>

        {/* Search and Filters */}
        <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-2xl border border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Search Doctors</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name, specialty, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl border-black/10 text-lg shadow-sm focus:ring-4 focus:ring-[var(--brand)]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Specialty</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="pl-9 h-14 w-full md:w-[200px] bg-white rounded-2xl border border-black/10 text-sm font-medium outline-none shadow-sm focus:ring-4 focus:ring-[var(--brand)]/20 appearance-none"
                >
                  {specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button 
              className="h-14 px-8 rounded-2xl bg-gray-900 text-white hover:bg-black font-semibold flex items-center gap-2"
              onClick={() => {}}
            >
              Search Professionals
            </Button>
          </div>
        </section>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">
              Found <span className="font-bold text-gray-900">{filteredDoctors.length}</span> results
            </p>
            {loading && <RefreshCcw className="h-4 w-4 animate-spin text-[var(--brand)]" />}
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && doctors.length === 0 ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-[280px] rounded-3xl bg-gray-100 animate-pulse" />
              ))
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <Card key={doctor.doctorId} className="group rounded-3xl border border-black/5 bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-24 bg-gradient-to-r from-[var(--brand)]/40 to-[#e8f4f4] transition-all group-hover:h-20" />
                    <div className="px-6 pb-6 -mt-10">
                      <div className="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center font-bold text-2xl text-gray-700 mx-auto transition-transform group-hover:scale-110">
                        {doctor.profile?.firstName?.[0]}{doctor.profile?.lastName?.[0]}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.profile?.firstName} {doctor.profile?.lastName}</h3>
                        <div className="flex items-center justify-center gap-2 mt-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 w-fit mx-auto">
                          <Stethoscope className="h-3 w-3 text-[#8ab6b6]" />
                          <span className="text-xs font-semibold text-gray-600">{doctor.specialty}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-center gap-4 py-4 border-y border-gray-50">
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold">4.9</span>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Rating</p>
                        </div>
                        <div className="w-px h-6 bg-gray-100" />
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-bold text-gray-700">Remote</span>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Location</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link href={`/patient/search/${doctor.doctorId}/book`}>
                          <Button className="w-full h-12 rounded-2xl bg-[var(--brand)] text-gray-900 font-bold hover:bg-[#b3d8d8] flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Book Appointment
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : !loading && (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-gray-50/50">
                  <UserIcon className="h-10 w-10 text-gray-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No specialists found</h3>
                  <p className="text-gray-500 px-6">
                    We couldn&apos;t find any doctors matching &quot;{searchQuery}&quot; in {selectedSpecialty}.
                  </p>
                  <Button variant="ghost" onClick={() => { setSearchQuery(''); setSelectedSpecialty('All'); }}>
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}