"use client";

import { useState } from "react";
import { CreditCard, Download, Filter, Calendar, DollarSign, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentHistoryPage() {
  const [filter, setFilter] = useState("all");

  const payments = [
    {
      id: "PAY-001",
      date: "2024-12-10",
      description: "Consultation - Dr. Sarah Johnson",
      amount: 150.00,
      status: "paid",
      method: "Credit Card",
      invoiceId: "INV-2024-001"
    },
    {
      id: "PAY-002", 
      date: "2024-11-28",
      description: "Blood Test - Laboratory Services",
      amount: 85.00,
      status: "paid",
      method: "Insurance",
      invoiceId: "INV-2024-002"
    },
    {
      id: "PAY-003",
      date: "2024-11-15",
      description: "X-Ray Examination - Radiology Dept",
      amount: 120.00,
      status: "paid",
      method: "Debit Card",
      invoiceId: "INV-2024-003"
    },
    {
      id: "PAY-004",
      date: "2024-11-05",
      description: "Prescription Medication",
      amount: 45.50,
      status: "pending",
      method: "Credit Card",
      invoiceId: "INV-2024-004"
    },
    {
      id: "PAY-005",
      date: "2024-10-22",
      description: "Specialist Consultation - Dr. Michael Chen",
      amount: 200.00,
      status: "paid",
      method: "Insurance",
      invoiceId: "INV-2024-005"
    }
  ];

  const filteredPayments = payments.filter(payment => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "failed":
        return "status-cancelled";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPaid = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">View your medical expenses and payment records</p>
        </div>
        
        {/* Filter */}
        <div className="mt-4 sm:mt-0">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalPending.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{payments.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">No payments match your current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {new Date(payment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-500">ID: {payment.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">{payment.method}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {payment.status === "paid" && (
                          <button
                            onClick={() => handleDownloadInvoice(payment.invoiceId)}
                            className="flex items-center text-teal-600 hover:text-teal-800 text-sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Invoice
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
