import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>NiceDentist Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Customers</h3>
            <p className="card-number">0</p>
            <span className="card-subtitle">Registered</span>
          </div>
          
          <div className="dashboard-card">
            <h3>Today's Appointments</h3>
            <p className="card-number">0</p>
            <span className="card-subtitle">Scheduled</span>
          </div>
          
          <div className="dashboard-card">
            <h3>Dentists</h3>
            <p className="card-number">0</p>
            <span className="card-subtitle">Active</span>
          </div>
          
          <div className="dashboard-card">
            <h3>Monthly Revenue</h3>
            <p className="card-number">$0</p>
            <span className="card-subtitle">This month</span>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Upcoming Appointments</h2>
          <div className="appointments-list">
            <p className="empty-state">No appointments scheduled for today.</p>
          </div>
        </div>
        
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button 
              className="action-button"
              onClick={() => onNavigate?.('customers')}
            >
              New Customer
            </button>
            <button 
              className="action-button"
              onClick={() => onNavigate?.('appointments')}
            >
              Schedule Appointment
            </button>
            <button 
              className="action-button"
              onClick={() => onNavigate?.('dentists')}
            >
              Register Dentist
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
