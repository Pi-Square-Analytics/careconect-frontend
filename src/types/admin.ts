export interface AdminSettings {
    systemMaintenance: boolean;
    maxFileUploadSize: number;
    sessionTimeout: number;
}

export interface AdminMetrics {
    users: {
        total: number;
        patients: number;
        doctors: number;
        active: number;
        pendingVerification: number;
        inactive: number;
    };
    appointments: {
        total: number;
        completed: number;
        scheduled: number;
    };
    invoices: {
        total: number;
        paid: number;
        pending: number;
    };
    generatedAt: string;
}

export interface AuditLog {
    logId: string;
    userId: string;
    action: string;
    details: string;
    timestamp: string;
    ipAddress: string;
}

export interface GenerateReportRequest {
    reportType: 'user_activity' | 'appointments' | 'financial';
    dateRange: {
        startDate: string;
        endDate: string;
    };
    format: 'pdf' | 'csv';
}
