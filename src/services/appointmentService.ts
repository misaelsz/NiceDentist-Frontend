import { managerApi } from './api';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentFilters,
  AppointmentStatus 
} from '../types/appointment';

export class AppointmentService {
  private static instance: AppointmentService;

  private constructor() {}

  public static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService();
    }
    return AppointmentService.instance;
  }

  async getAllAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.customerId) params.append('customerId', filters.customerId.toString());
    if (filters?.dentistId) params.append('dentistId', filters.dentistId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `/appointments?${queryString}` : '/appointments';
    
    const response = await managerApi.get<Appointment[]>(url);
    return response.data;
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const response = await managerApi.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  async getAppointmentsByCustomer(customerId: number): Promise<Appointment[]> {
    const response = await managerApi.get<Appointment[]>(`/appointments/customer/${customerId}`);
    return response.data;
  }

  async getAppointmentsByDentist(dentistId: number): Promise<Appointment[]> {
    const response = await managerApi.get<Appointment[]>(`/appointments/dentist/${dentistId}`);
    return response.data;
  }

  async createAppointment(appointment: CreateAppointmentRequest): Promise<Appointment> {
    const response = await managerApi.post<Appointment>('/appointments', appointment);
    return response.data;
  }

  async updateAppointment(appointment: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await managerApi.put<Appointment>(`/appointments/${appointment.id}`, appointment);
    return response.data;
  }

  async updateAppointmentStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const response = await managerApi.put<Appointment>(`/appointments/${id}/status`, { status });
    return response.data;
  }

  async deleteAppointment(id: number): Promise<void> {
    await managerApi.delete(`/appointments/${id}`);
  }

  async cancelAppointment(id: number, reason?: string): Promise<Appointment> {
    const response = await managerApi.put<Appointment>(`/appointments/${id}/cancel`, { reason });
    return response.data;
  }

  async completeAppointment(id: number, notes?: string): Promise<Appointment> {
    const response = await managerApi.put<Appointment>(`/appointments/${id}/complete`, { notes });
    return response.data;
  }


}
