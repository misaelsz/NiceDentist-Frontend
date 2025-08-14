import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Dashboard } from '../dashboard/Dashboard';
import { CustomerManagement } from '../customers/CustomerManagement';
import './Layout.css';

type ActiveView = 'dashboard' | 'customers' | 'appointments' | 'dentists' | 'reports';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const handleLogout = () => {
    logout();
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={(view) => setActiveView(view as ActiveView)} />;
      case 'customers':
        return <CustomerManagement />;
      case 'appointments':
        return <div className="coming-soon">Appointments Management - Coming Soon</div>;
      case 'dentists':
        return <div className="coming-soon">Dentist Management - Coming Soon</div>;
      case 'reports':
        return <div className="coming-soon">Reports - Coming Soon</div>;
      default:
        return <Dashboard onNavigate={(view) => setActiveView(view as ActiveView)} />;
    }
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>NiceDentist</h2>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        
        <ul className="nav-menu">
          <li>
            <button 
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeView === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveView('customers')}
            >
              <span className="nav-icon">👥</span>
              Customers
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeView === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveView('appointments')}
            >
              <span className="nav-icon">📅</span>
              Appointments
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeView === 'dentists' ? 'active' : ''}`}
              onClick={() => setActiveView('dentists')}
            >
              <span className="nav-icon">🦷</span>
              Dentists
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveView('reports')}
            >
              <span className="nav-icon">📈</span>
              Reports
            </button>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
};
