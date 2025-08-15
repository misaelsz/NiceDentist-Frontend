import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { customerService, dentistService, appointmentService } from '../../services/api';
import { Dentist } from '../../types';
import { Appointment } from '../../types/appointment';
import './Dashboard.css';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

interface DashboardStats {
  totalCustomers: number;
  totalDentists: number;
  todaysAppointments: number;
  totalAppointments: number;
  upcomingAppointments: Appointment[];
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalDentists: 0,
    todaysAppointments: 0,
    totalAppointments: 0,
    upcomingAppointments: [],
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Load customers, dentists, and appointments in parallel
      const [customersResponse, dentistsResponse, appointmentsResponse] = await Promise.all([
        customerService.getAll(1, 1000), // Get all customers
        dentistService.list(1, 1000), // Get all dentists
        appointmentService.getAll({ page: 1, pageSize: 100 }) // Get recent appointments
      ]);

      const customers = customersResponse.data || customersResponse.items || [];
      const dentists = dentistsResponse.data || dentistsResponse.items || [];
      const appointments = appointmentsResponse || [];

      // Filter today's appointments
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

      const todaysAppointments = appointments.filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentDateTime);
        return aptDate >= todayStart && aptDate <= todayEnd;
      });

      // Get next 7 days appointments count (for the card)
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const next7DaysAppointments = appointments.filter((apt: Appointment) => {
        const aptDate = new Date(apt.appointmentDateTime);
        return aptDate >= today && aptDate <= nextWeek;
      });

      setStats({
        totalCustomers: customers.length,
        totalDentists: dentists.filter((d: Dentist) => d.isActive).length,
        todaysAppointments: next7DaysAppointments.length, // Card shows next 7 days count
        totalAppointments: appointments.length,
        upcomingAppointments: todaysAppointments.sort((a: Appointment, b: Appointment) => 
          new Date(a.appointmentDateTime).getTime() - new Date(b.appointmentDateTime).getTime()
        ).slice(0, 5), // Section shows today's appointments
        loading: false
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getSystemStatus = () => {
    if (stats.loading) return '...';
    return stats.totalAppointments || 0;
  };

  const renderAppointmentsList = () => {
    if (stats.loading) {
      return (
        <div className="loading-appointments">
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
          <div className="loading-skeleton"></div>
        </div>
      );
    }

    if (stats.upcomingAppointments.length === 0) {
      return <p className="empty-state">No appointments scheduled for today.</p>;
    }

    return (
      <div className="dashboard-appointment-cards">
        {stats.upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className="appointment-item">
            <div className="appointment-info">
              <div className="appointment-patient">
                <strong>{appointment.customerName}</strong>
              </div>
              <div className="appointment-dentist">
                with {appointment.dentistName}
              </div>
              <div className="appointment-procedure">
                {appointment.procedureType}
              </div>
            </div>
            <div className="appointment-time">
              {formatDateTime(appointment.appointmentDateTime)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>NiceDentist Dashboard</h1>
          <div className="user-info">
            <span>{getGreeting()}, {user?.name}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card customers-card">
            <h3>Customers</h3>
            <p className="card-number">
              {stats.loading ? (
                <span className="loading-number">...</span>
              ) : (
                stats.totalCustomers
              )}
            </p>
            <span className="card-subtitle">Registered</span>
          </div>
          
          <div className="dashboard-card appointments-card">
            <h3>Next 7 Days</h3>
            <p className="card-number">
              {stats.loading ? (
                <span className="loading-number">...</span>
              ) : (
                stats.todaysAppointments
              )}
            </p>
            <span className="card-subtitle">Appointments</span>
          </div>
          
          <div className="dashboard-card dentists-card">
            <h3>Dentists</h3>
            <p className="card-number">
              {stats.loading ? (
                <span className="loading-number">...</span>
              ) : (
                stats.totalDentists
              )}
            </p>
            <span className="card-subtitle">Active</span>
          </div>
          
          <div className="dashboard-card revenue-card">
            <h3>Total Appointments</h3>
            <p className="card-number">
              {getSystemStatus()}
            </p>
            <span className="card-subtitle">All Time</span>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Today's Appointments</h2>
          <div className="appointments-list">
            {renderAppointmentsList()}
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button 
              className="action-button customers-action"
              onClick={() => onNavigate?.('customers')}
            >
              <span className="action-icon">👥</span>
              {' '}New Customer
            </button>
            <button 
              className="action-button appointments-action"
              onClick={() => onNavigate?.('appointments')}
            >
              <span className="action-icon">📅</span>
              {' '}Schedule Appointment
            </button>
            <button 
              className="action-button dentists-action"
              onClick={() => onNavigate?.('dentists')}
            >
              <span className="action-icon">👨‍⚕️</span>
              {' '}Register Dentist
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
