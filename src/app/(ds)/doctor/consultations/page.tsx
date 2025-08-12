/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';

// Dummy doctor profile
const doctorProfile = {
  firstName: 'John',
  lastName: 'Doe',
  specialization: 'Cardiologist',
  email: 'john.doe@example.com',
  phone: '+250 788 123 456',
};

// Dummy patients
const dummyPatients = [
  { id: 1, name: 'Alice Smith', age: 29, gender: 'Female' },
  { id: 2, name: 'James Brown', age: 45, gender: 'Male' },
  { id: 3, name: 'Maria Johnson', age: 34, gender: 'Female' },
];

export default function ConsultationsPage() {
  const [patients] = useState(dummyPatients);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [formData, setFormData] = useState({ chiefComplaint: '', notes: '', prescription: '' });

  // Load consultations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('consultations');
    if (saved) {
      setConsultations(JSON.parse(saved));
    }
  }, []);

  // Save consultations to localStorage
  useEffect(() => {
    localStorage.setItem('consultations', JSON.stringify(consultations));
  }, [consultations]);

  const handleAddConsultation = () => {
    if (!selectedPatient || !formData.chiefComplaint.trim()) return;

    const newConsultation = {
      id: Date.now(),
      patientId: selectedPatient.id,
      ...formData,
      date: new Date().toLocaleString(),
    };

    setConsultations([newConsultation, ...consultations]);
    setFormData({ chiefComplaint: '', notes: '', prescription: '' });
  };

  const patientConsultations = consultations.filter(c => c.patientId === selectedPatient?.id);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      {/* Doctor Profile Header */}
      <div className="bg-[#C4E1E1] p-6 rounded-xl shadow-lg mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{doctorProfile.firstName} {doctorProfile.lastName}</h1>
          <p className="text-gray-700">{doctorProfile.specialization}</p>
          <p className="text-sm text-gray-600">{doctorProfile.email} | {doctorProfile.phone}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold mb-4">Patients</h2>
          <ul>
            {patients.map(patient => (
              <li
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-[#C4E1E1] ${selectedPatient?.id === patient.id ? 'bg-[#C4E1E1]' : 'bg-gray-50'}`}
              >
                <p className="font-medium">{patient.name}</p>
                <p className="text-sm text-gray-600">Age: {patient.age} | {patient.gender}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Consultation Form & History */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-4">
          {selectedPatient ? (
            <>
              <h2 className="text-lg font-bold mb-2">Consultation for {selectedPatient.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Chief Complaint"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="p-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Prescription"
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  className="p-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleAddConsultation}
                className="bg-[#C4E1E1] hover:bg-[#a7cccc] text-black px-4 py-2 rounded-lg font-medium"
              >
                Add Consultation
              </button>

              {/* Patient's Consultation History */}
              <h3 className="text-md font-semibold mt-6">Previous Consultations</h3>
              {patientConsultations.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {patientConsultations.map(c => (
                    <li key={c.id} className="border p-3 rounded-lg">
                      <p className="font-medium">{c.chiefComplaint}</p>
                      <p className="text-sm text-gray-600">{c.notes}</p>
                      <p className="text-sm text-gray-600 italic">Prescription: {c.prescription}</p>
                      <p className="text-xs text-gray-500">{c.date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No consultations yet.</p>
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a patient to start consultation</p>
          )}
        </div>
      </div>
    </div>
  );
}
