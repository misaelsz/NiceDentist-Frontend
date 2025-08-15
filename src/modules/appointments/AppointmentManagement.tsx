import React, { useState } from 'react';
import { AppointmentList } from './AppointmentList';
import { AppointmentForm } from './AppointmentForm';
import { useAppointments } from '../../hooks/useAppointments';
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../types/appointment';
import './AppointmentManagement.css';

type ViewMode = 'list' | 'create' | 'edit';

export const AppointmentManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { createAppointment, updateAppointment, loading } = useAppointments();

  const handleNew = () => {
    setSelectedAppointment(undefined);
    setViewMode('create');
    setMessage(null);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewMode('edit');
    setMessage(null);
  };

  const handleCancel = () => {
    setSelectedAppointment(undefined);
    setViewMode('list');
    setMessage(null);
  };

  const handleSubmit = async (data: CreateAppointmentRequest | UpdateAppointmentRequest) => {
    try {
      let result: Appointment | null = null;
      
      if ('id' in data) {
        // Update existing appointment
        result = await updateAppointment(data);
        if (result) {
          setMessage({ type: 'success', text: 'Appointment updated successfully!' });
        }
      } else {
        // Create new appointment
        result = await createAppointment(data);
        if (result) {
          setMessage({ type: 'success', text: 'Appointment scheduled successfully!' });
        }
      }

      if (result) {
        setSelectedAppointment(undefined);
        setViewMode('list');
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save appointment. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving the appointment.' });
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
      case 'edit':
        return (
          <AppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        );
      default:
        return (
          <AppointmentList
            onNew={handleNew}
            onEdit={handleEdit}
          />
        );
    }
  };

  return (
    <div className="appointment-management">
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button 
            className="message-close" 
            onClick={() => setMessage(null)}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};
