export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export interface DoctorAvailability {
    availabilityId: string;
    doctorId: string;
    dayOfWeek: number; // 0-6 (Sun-Sat) or 1-7 (Mon-Sun) depending on implementation
    startTime: string;
    endTime: string;
    slotDuration: number;
    isActive: boolean;
}

export interface CreateAvailabilityRequest {
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    isActive: boolean;
}

export interface UpdateAvailabilityRequest {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    slotDuration?: number;
    isActive?: boolean;
}

export interface UpdateAvailabilityStatusRequest {
    status: boolean;
}

export interface BulkUpdateAvailabilityRequest {
    doctorId: string;
    isActive: boolean;
    dayOfWeek: number;
    reason?: string;
}
