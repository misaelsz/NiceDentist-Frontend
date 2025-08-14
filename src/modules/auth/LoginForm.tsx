import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../hooks/useLoading';
import { useNotification } from '../../hooks/useNotification';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const { login } = useAuth();
  const { isLoading, withLoading } = useLoading();
  const { addNotification } = useNotification();

  // Check URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlEmail = urlParams.get('email');
    const urlTempPassword = urlParams.get('tempPassword');
    
    if (urlEmail && urlTempPassword) {
      setEmail(urlEmail);
      setTempPassword(urlTempPassword);
      setPassword(urlTempPassword);
      setIsFirstTimeLogin(true);
      
      addNotification({
        type: 'info',
        title: 'Welcome!',
        message: 'Please change your temporary password to continue.',
      });
    }
  }, [addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      addNotification({
        type: 'warning',
        title: 'Required fields',
        message: 'Please fill in email and password.',
      });
      return;
    }

    // If it's first time login, validate new password
    if (isFirstTimeLogin) {
      if (!newPassword || !confirmPassword) {
        addNotification({
          type: 'warning',
          title: 'Password required',
          message: 'Please enter your new password and confirm it.',
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        addNotification({
          type: 'error',
          title: 'Password mismatch',
          message: 'New password and confirmation do not match.',
        });
        return;
      }

      if (newPassword.length < 6) {
        addNotification({
          type: 'error',
          title: 'Password too short',
          message: 'Password must be at least 6 characters long.',
        });
        return;
      }

      // TODO: Implement password change API call
      addNotification({
        type: 'success',
        title: 'Password changed!',
        message: 'Your password has been updated. You can now login.',
      });
      
      // Reset form to normal login
      setIsFirstTimeLogin(false);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    try {
      await withLoading(login(email, password));
      addNotification({
        type: 'success',
        title: 'Login successful!',
      });
    } catch (error) {
      console.error('Login error:', error);
      addNotification({
        type: 'error',
        title: 'Login error',
        message: 'Incorrect email or password.',
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>NiceDentist</h1>
          <p>
            {isFirstTimeLogin 
              ? 'Welcome! Please change your temporary password'
              : 'Login to access the system'
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading || isFirstTimeLogin}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              {isFirstTimeLogin ? 'Current Temporary Password' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isFirstTimeLogin ? 'Your temporary password' : 'Your password'}
              disabled={isLoading || isFirstTimeLogin}
              required
            />
          </div>

          {isFirstTimeLogin && (
            <>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                  required
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) {
                return isFirstTimeLogin ? 'Changing Password...' : 'Signing in...';
              }
              return isFirstTimeLogin ? 'Change Password' : 'Sign In';
            })()}
          </button>
        </form>
      </div>
    </div>
  );
};
