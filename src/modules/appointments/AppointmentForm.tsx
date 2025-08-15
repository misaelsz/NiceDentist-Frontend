import React, { useState } from 'react';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../types/appointment';
import './AppointmentForm.css';

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (data: CreateAppointmentRequest | UpdateAppointmentRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    customerId: appointment?.customerId || 0,
    dentistId: appointment?.dentistId || 0,
    appointmentDateTime: appointment?.appointmentDateTime ? 
      new Date(appointment.appointmentDateTime).toISOString().slice(0, 16) : '',
    procedureType: appointment?.procedureType || '',
    notes: appointment?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // TODO: Replace with actual hooks once available
  const customers = [
    { id: 1, name: 'Maria Silva', email: 'maria.silva@email.com' },
    { id: 2, name: 'João Santos', email: 'joao.santos@email.com' },
    { id: 3, name: 'Ana Costa', email: 'ana.costa@email.com' }
  ];
  
  const dentists = [
    { id: 1, name: 'Dr. Carlos Oliveira', specialization: 'Ortodontia', isActive: true },
    { id: 2, name: 'Dra. Fernanda Lima', specialization: 'Endodontia', isActive: true },
    { id: 3, name: 'Dr. Roberto Dias', specialization: 'Implantologia', isActive: true }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required';
    }

    if (!formData.dentistId) {
      newErrors.dentistId = 'Dentist is required';
    }

    if (!formData.appointmentDateTime) {
      newErrors.appointmentDateTime = 'Date and time is required';
    } else {
      const appointmentDate = new Date(formData.appointmentDateTime);
      const now = new Date();
      
      if (appointmentDate <= now) {
        newErrors.appointmentDateTime = 'Appointment must be in the future';
      }

      // Check business hours (8 AM to 6 PM)
      const hours = appointmentDate.getHours();
      if (hours < 8 || hours >= 18) {
        newErrors.appointmentDateTime = 'Appointments must be between 8:00 AM and 6:00 PM';
      }

      // Check if it's weekend
      const dayOfWeek = appointmentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newErrors.appointmentDateTime = 'Appointments cannot be scheduled on weekends';
      }
    }

    if (!formData.procedureType.trim()) {
      newErrors.procedureType = 'Procedure type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (appointment) {
        // Update existing appointment
        const updateData: UpdateAppointmentRequest = {
          id: appointment.id,
          customerId: formData.customerId,
          dentistId: formData.dentistId,
          appointmentDateTime: new Date(formData.appointmentDateTime).toISOString(),
          procedureType: formData.procedureType.trim(),
          notes: formData.notes.trim()
        };
        await onSubmit(updateData);
      } else {
        // Create new appointment
        const createData: CreateAppointmentRequest = {
          customerId: formData.customerId,
          dentistId: formData.dentistId,
          appointmentDateTime: new Date(formData.appointmentDateTime).toISOString(),
          procedureType: formData.procedureType.trim(),
          notes: formData.notes.trim()
        };
        await onSubmit(createData);
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getSubmitButtonText = (): string => {
    if (loading) return 'Saving...';
    return appointment ? 'Update Appointment' : 'Schedule Appointment';
  };

  return (
    <div className="appointment-form-container">
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-header">
          <h2>{appointment ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="customerId">Customer *</label>
            <select
              id="customerId"
              value={formData.customerId}
              onChange={(e) => handleInputChange('customerId', Number(e.target.value))}
              className={errors.customerId ? 'error' : ''}
              required
            >
              <option value={0}>Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
            {errors.customerId && <span className="error-message">{errors.customerId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dentistId">Dentist *</label>
            <select
              id="dentistId"
              value={formData.dentistId}
              onChange={(e) => handleInputChange('dentistId', Number(e.target.value))}
              className={errors.dentistId ? 'error' : ''}
              required
            >
              <option value={0}>Select a dentist</option>
              {dentists.filter(d => d.isActive).map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.name} - {dentist.specialization}
                </option>
              ))}
            </select>
            {errors.dentistId && <span className="error-message">{errors.dentistId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDateTime">Date & Time *</label>
            <input
              type="datetime-local"
              id="appointmentDateTime"
              value={formData.appointmentDateTime}
              onChange={(e) => handleInputChange('appointmentDateTime', e.target.value)}
              className={errors.appointmentDateTime ? 'error' : ''}
              required
            />
            {errors.appointmentDateTime && <span className="error-message">{errors.appointmentDateTime}</span>}
            <small className="form-hint">Business hours: 8:00 AM - 6:00 PM, Monday to Friday</small>
          </div>

          <div className="form-group">
            <label htmlFor="procedureType">Procedure Type *</label>
            <input
              type="text"
              id="procedureType"
              value={formData.procedureType}
              onChange={(e) => handleInputChange('procedureType', e.target.value)}
              className={errors.procedureType ? 'error' : ''}
              placeholder="e.g., Cleaning, Root Canal, Filling"
              required
            />
            {errors.procedureType && <span className="error-message">{errors.procedureType}</span>}
          </div>

          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about the appointment"
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {getSubmitButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
};
