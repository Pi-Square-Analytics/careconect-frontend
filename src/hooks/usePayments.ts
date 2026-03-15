
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api/api';

export const PAYMENT_KEYS = {
    all: ['payments'] as const,
    invoices: (userId: string) => [...PAYMENT_KEYS.all, 'invoices', userId] as const,
};

export type Invoice = {
  invoiceId: string;
  totalAmount: number | string;
  currency?: string;
  dueDate?: string; // ISO
  createdAt?: string; // ISO
  status?: 'paid' | 'unpaid' | 'overdue' | string;
  paidAt?: string; // ISO
  pdfUrl?: string;
  notes?: string;
  planId?: string;
};

export function useInvoices(userId: string) {
    return useQuery({
        queryKey: PAYMENT_KEYS.invoices(userId),
        queryFn: async () => {
            const res = await api.get(`/invoice/invoices/patient/${userId}`);
            const data = res.data?.data || res.data || [];
            return Array.isArray(data) ? (data as Invoice[]) : [];
        },
        enabled: !!userId,
    });
}

/**
 * Hook for initiating an internal payment record (if needed by the backend).
 * In the Taag flow, we primarily redirect, but maybe the backend wants to know.
 */
export function useInitiatePayment() {
    return useMutation({
        mutationFn: async (data: { invoiceId: string; paymentMethod: string; phoneNumber?: string }) => {
            const res = await api.post('/payments/initiate', data);
            return res.data;
        },
    });
}
