// Auth Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Dentist' | 'Customer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CustomerRequest {
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  customerId: number;
  dentistId: number;
  appointmentDateTime: string;
  procedureType: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'CancellationRequested';
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRequest {
  customerId: number;
  dentistId: number;
  appointmentDateTime: string;
  procedureType: string;
  notes?: string;
}

// Dentist Types
export interface Dentist {
  id: number;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialization: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
