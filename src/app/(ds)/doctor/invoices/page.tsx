/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';

// Dummy patients list for now
const dummyPatients = [
  { id: 1, name: 'John Doe', age: 45 },
  { id: 2, name: 'Jane Smith', age: 38 },
  { id: 3, name: 'Samuel Green', age: 29 },
];

export default function InvoicePage() {
  const [patients] = useState(dummyPatients);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Load saved invoices from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('invoices');
    if (saved) setInvoices(JSON.parse(saved));
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleAddInvoice = () => {
    if (!selectedPatient || !amount || !description) return alert('Fill all fields');
    const newInvoice = {
      id: Date.now(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      amount,
      description,
      date: new Date().toLocaleString(),
    };
    setInvoices([newInvoice, ...invoices]);
    setAmount('');
    setDescription('');
    setSelectedPatient(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#C4E1E1' }}>
        Invoices Management
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Patients List */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Select a Patient</h2>
          <ul className="space-y-3">
            {patients.map((p) => (
              <li
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`p-3 rounded-lg cursor-pointer border ${
                  selectedPatient?.id === p.id ? 'bg-[#C4E1E1] border-[#C4E1E1]' : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">Age: {p.age}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Invoice Form */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Invoice</h2>
          {selectedPatient ? (
            <>
              <p className="mb-2 font-medium">
                Patient: <span className="text-gray-700">{selectedPatient.name}</span>
              </p>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg mb-3"
              />
              <button
                onClick={handleAddInvoice}
                className="w-full bg-[#C4E1E1] hover:bg-[#b3d8d8] text-black font-semibold py-2 rounded-lg"
              >
                Save Invoice
              </button>
            </>
          ) : (
            <p className="text-gray-500">Select a patient to create an invoice.</p>
          )}
        </div>
      </div>

      {/* Invoices List */}
      <div className="mt-10 bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Saved Invoices</h2>
        {invoices.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#C4E1E1]">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{inv.date}</td>
                  <td className="p-2 border">{inv.patientName}</td>
                  <td className="p-2 border">${inv.amount}</td>
                  <td className="p-2 border">{inv.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No invoices found.</p>
        )}
      </div>
    </div>
  );
}
