import { useState, useEffect, useCallback } from 'react';
import { AppointmentService } from '../services/appointmentService';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentFilters,
  AppointmentStatus 
} from '../types/appointment';

export const useAppointments = (filters?: AppointmentFilters) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appointmentService = AppointmentService.getInstance();

  const fetchAppointments = useCallback(async (currentFilters?: AppointmentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAllAppointments(currentFilters || filters);
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading appointments');
    } finally {
      setLoading(false);
    }
  }, [appointmentService, filters]);

  const createAppointment = async (appointment: CreateAppointmentRequest): Promise<Appointment | null> => {
    setLoading(true);
    setError(null);
    try {
      const newAppointment = await appointmentService.createAppointment(appointment);
      setAppointments(prev => [newAppointment, ...prev]);
      return newAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating appointment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (appointment: UpdateAppointmentRequest): Promise<Appointment | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await appointmentService.updateAppointment(appointment);
      setAppointments(prev => 
        prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
      );
      return updatedAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating appointment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: AppointmentStatus): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status);
      setAppointments(prev => 
        prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating appointment status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await appointmentService.deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting appointment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: number, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await appointmentService.cancelAppointment(id, reason);
      setAppointments(prev => 
        prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cancelling appointment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (id: number, notes?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const updatedAppointment = await appointmentService.completeAppointment(id, notes);
      setAppointments(prev => 
        prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error completing appointment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestCancellation = async (id: number): Promise<boolean> => {
    return updateAppointmentStatus(id, AppointmentStatus.CancellationRequested);
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    cancelAppointment,
    completeAppointment,
    requestCancellation,
    refetch: () => fetchAppointments()
  };
};
