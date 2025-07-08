"use client";

import { useState } from "react";
import { DollarSign, CreditCard, TrendingUp, Search, Filter, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaymentTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const payments = [
    {
      id: "PAY-001",
      patientName: "John Doe",
      patientEmail: "john.doe@email.com",
      doctorName: "Dr. Sarah Johnson",
      service: "Cardiology Consultation",
      amount: 150.00,
      date: "2024-12-10",
      status: "paid",
      method: "Credit Card",
      transactionId: "TXN-2024-001"
    },
    {
      id: "PAY-002",
      patientName: "Jane Smith",
      patientEmail: "jane.smith@email.com",
      doctorName: "Dr. Michael Chen",
      service: "Dermatology Treatment",
      amount: 200.00,
      date: "2024-12-09",
      status: "pending",
      method: "Insurance",
      transactionId: "TXN-2024-002"
    },
    {
      id: "PAY-003",
      patientName: "Bob Wilson",
      patientEmail: "bob.wilson@email.com",
      doctorName: "Dr. Emily Davis",
      service: "Pediatric Checkup",
      amount: 120.00,
      date: "2024-12-08",
      status: "paid",
      method: "Debit Card",
      transactionId: "TXN-2024-003"
    },
    {
      id: "PAY-004",
      patientName: "Alice Brown",
      patientEmail: "alice.brown@email.com",
      doctorName: "Dr. Robert Wilson",
      service: "Orthopedic Surgery",
      amount: 2500.00,
      date: "2024-12-07",
      status: "paid",
      method: "Insurance",
      transactionId: "TXN-2024-004"
    },
    {
      id: "PAY-005",
      patientName: "Charlie Davis",
      patientEmail: "charlie.davis@email.com",
      doctorName: "Dr. Sarah Johnson",
      service: "Heart Consultation",
      amount: 180.00,
      date: "2024-12-06",
      status: "failed",
      method: "Credit Card",
      transactionId: "TXN-2024-005"
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesDate = !dateFilter || payment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "failed":
        return "status-cancelled";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = payments.filter(p => p.status === "failed").reduce((sum, p) => sum + p.amount, 0);

  const handleViewDetails = (paymentId: string) => {
    alert(`View payment details for ${paymentId}`);
  };

  const handleDownloadReport = () => {
    alert("Download payment report");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Tracking</h1>
          <p className="text-gray-600">Monitor and track all payment transactions</p>
        </div>
        
        <button onClick={handleDownloadReport} className="mt-4 sm:mt-0 btn-primary flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search by patient, doctor, service, or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="input-field w-48"
          placeholder="Filter by date"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
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
                <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Pending Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${failedAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Failed Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{payments.length}</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">No payments match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Payment ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{payment.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{payment.patientName}</p>
                          <p className="text-sm text-gray-500">{payment.patientEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{payment.service}</p>
                          <p className="text-sm text-gray-500">{payment.doctorName}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600">
                          {new Date(payment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
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
                        <button
                          onClick={() => handleViewDetails(payment.id)}
                          className="flex items-center text-teal-600 hover:text-teal-800 text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
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
