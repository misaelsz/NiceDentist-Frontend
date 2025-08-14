import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { useLoading } from '../../hooks/useLoading';
import './CustomerForm.css';

interface CustomerFormProps {
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotification();
  const { isLoading, withLoading } = useLoading();

  const isEditing = !!customer;

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Focus the modal when it opens
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        dateOfBirth: customer.dateOfBirth 
          ? new Date(customer.dateOfBirth).toISOString().split('T')[0]
          : '',
        address: customer.address || '',
        isActive: customer.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        isActive: true
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.dateOfBirth = 'Date of birth must be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && customer) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || undefined,
          address: formData.address || undefined
        };

        await withLoading(customerService.update(customer.id, updateData));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Customer updated successfully.'
        });
      } else {
        const createData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || undefined,
          address: formData.address || undefined
        };

        await withLoading(customerService.create(createData));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Customer created successfully.'
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      
      // Handle validation errors from backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        Object.keys(error.response.data.errors).forEach(key => {
          backendErrors[key.toLowerCase()] = error.response.data.errors[key][0];
        });
        setErrors(backendErrors);
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: `Failed to ${isEditing ? 'update' : 'create'} customer.`
        });
      }
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const loadingText = isEditing ? 'Updating...' : 'Creating...';
  const submitText = isEditing ? 'Update Customer' : 'Create Customer';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Customer' : 'New Customer'}</h2>
          <button
            className="close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
                placeholder="Enter customer name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
                disabled={isLoading}
                placeholder="Enter phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={errors.dateOfBirth ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'error' : ''}
                disabled={isLoading}
                placeholder="Enter address"
                rows={3}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span className="checkbox-text">Active</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? loadingText : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
