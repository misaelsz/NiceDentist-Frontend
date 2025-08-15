export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  dentistId: number;
  dentistName: string;
  appointmentDateTime: string;
  procedureType: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  CancellationRequested = 'CancellationRequested'
}

export interface CreateAppointmentRequest {
  customerId: number;
  dentistId: number;
  appointmentDateTime: string;
  procedureType: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  id: number;
  customerId: number;
  dentistId: number;
  appointmentDateTime: string;
  procedureType: string;
  notes?: string;
}

export interface AppointmentFilters {
  page?: number;
  pageSize?: number;
  customerId?: number;
  dentistId?: number;
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus;
}
