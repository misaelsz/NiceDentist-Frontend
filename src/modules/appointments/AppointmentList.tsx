import React, { useState } from 'react';
import { Appointment, AppointmentStatus, AppointmentFilters } from '../../types/appointment';
import { useAppointments } from '../../hooks/useAppointments';
import './AppointmentList.css';

interface AppointmentListProps {
  onEdit?: (appointment: Appointment) => void;
  onNew?: () => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ onEdit, onNew }) => {
  const [filters, setFilters] = useState<AppointmentFilters>({
    page: 1,
    pageSize: 10
  });

  const {
    appointments,
    loading,
    error,
    cancelAppointment,
    completeAppointment,
    deleteAppointment,
    fetchAppointments
  } = useAppointments(filters);

  const handleStatusChange = async (id: number, status: AppointmentStatus) => {
    const confirmed = window.confirm(`Are you sure you want to ${status.toLowerCase()} this appointment?`);
    if (!confirmed) return;

    let success = false;
    switch (status) {
      case AppointmentStatus.Cancelled:
        success = await cancelAppointment(id);
        break;
      case AppointmentStatus.Completed:
        success = await completeAppointment(id);
        break;
      default:
        break;
    }

    if (success) {
      await fetchAppointments(filters);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this appointment?');
    if (!confirmed) return;

    const success = await deleteAppointment(id);
    if (success) {
      await fetchAppointments(filters);
    }
  };

  const getStatusClass = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return 'status-scheduled';
      case AppointmentStatus.Completed:
        return 'status-completed';
      case AppointmentStatus.Cancelled:
        return 'status-cancelled';
      case AppointmentStatus.CancellationRequested:
        return 'status-cancellation-requested';
      default:
        return '';
    }
  };

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString();
  };

  const handleFilterChange = (newFilters: Partial<AppointmentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchAppointments(updatedFilters);
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="appointment-list">
      <div className="appointment-list-header">
        <h2>Appointments</h2>
        <button className="btn btn-primary" onClick={onNew}>
          Schedule New Appointment
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filters.status || ''}
            onChange={(e) => handleFilterChange({ 
              status: e.target.value as AppointmentStatus || undefined 
            })}
          >
            <option value="">All</option>
            <option value={AppointmentStatus.Scheduled}>Scheduled</option>
            <option value={AppointmentStatus.Completed}>Completed</option>
            <option value={AppointmentStatus.Cancelled}>Cancelled</option>
            <option value={AppointmentStatus.CancellationRequested}>Cancellation Requested</option>
          </select>
        </div>
      </div>

      <div className="appointment-table-container">
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found.</p>
            <button className="btn btn-primary" onClick={onNew}>
              Schedule First Appointment
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Dentist</th>
                  <th>Procedure</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDateTime(appointment.appointmentDateTime)}</td>
                    <td>{appointment.customerName}</td>
                    <td>{appointment.dentistName}</td>
                    <td>{appointment.procedureType}</td>
                    <td>
                      <span className={`status ${getStatusClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => onEdit?.(appointment)}
                        >
                          Edit
                        </button>
                        
                        {appointment.status === AppointmentStatus.Scheduled && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Completed)}
                            >
                              Complete
                            </button>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Cancelled)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Mobile Cards View - Outside table container */}
      {appointments.length > 0 && (
        <div className="appointment-cards">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-card-header">
                <div className="appointment-card-date">
                  {formatDateTime(appointment.appointmentDateTime)}
                </div>
                <div className="appointment-card-status">
                  <span className={`status ${getStatusClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
              
              <div className="appointment-card-body">
                <div className="appointment-card-row">
                  <span className="appointment-card-label">Customer:</span>
                  <span className="appointment-card-value">{appointment.customerName}</span>
                </div>
                <div className="appointment-card-row">
                  <span className="appointment-card-label">Dentist:</span>
                  <span className="appointment-card-value">{appointment.dentistName}</span>
                </div>
                <div className="appointment-card-row">
                  <span className="appointment-card-label">Procedure:</span>
                  <span className="appointment-card-value">{appointment.procedureType}</span>
                </div>
              </div>
              
              <div className="appointment-card-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => onEdit?.(appointment)}
                >
                  Edit
                </button>
                
                {appointment.status === AppointmentStatus.Scheduled && (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Completed)}
                    >
                      Complete
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleStatusChange(appointment.id, AppointmentStatus.Cancelled)}
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(appointment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
