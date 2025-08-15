import React, { useState, useEffect } from 'react';
import { Dentist } from '../../types';
import { dentistService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { useLoading } from '../../hooks/useLoading';
import './DentistForm.css';

interface DentistFormProps {
  dentist?: Dentist;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DentistForm: React.FC<DentistFormProps> = ({
  dentist,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    isActive: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotification();
  const { isLoading, withLoading } = useLoading();

  const isEditing = !!dentist;

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (dentist) {
      setFormData({
        name: dentist.name || '',
        email: dentist.email || '',
        phone: dentist.phone || '',
        licenseNumber: dentist.licenseNumber || '',
        specialization: dentist.specialization || '',
        isActive: dentist.isActive ?? true
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',
        specialization: '',
        isActive: true
      });
    }
    setErrors({});
  }, [dentist, isOpen]);

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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
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
      if (isEditing && dentist) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
          isActive: formData.isActive
        };

        await withLoading(dentistService.update(dentist.id, updateData));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Dentist updated successfully.'
        });
      } else {
        const createData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization
        };

        await withLoading(dentistService.create(createData));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Dentist created successfully.'
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving dentist:', error);
      
      // Handle specific error responses from backend
      if (error.response?.status === 409) {
        // Conflict - duplicate data
        const errorData = error.response.data;
        
        if (errorData?.code === 'DUPLICATE_EMAIL') {
          setErrors({ email: 'This email address is already registered.' });
          addNotification({
            type: 'error',
            title: 'Duplicate Email',
            message: 'A dentist with this email address already exists.'
          });
          return;
        } else if (errorData?.code === 'DUPLICATE_LICENSE') {
          setErrors({ licenseNumber: 'This license number is already registered.' });
          addNotification({
            type: 'error',
            title: 'Duplicate License Number',
            message: 'A dentist with this license number already exists.'
          });
          return;
        }
      } else if (error.response?.status === 400) {
        // Handle validation errors from backend
        if (error.response?.data?.errors) {
          const backendErrors: Record<string, string> = {};
          Object.keys(error.response.data.errors).forEach(key => {
            backendErrors[key.toLowerCase()] = error.response.data.errors[key][0];
          });
          setErrors(backendErrors);
          return;
        } else if (error.response?.data?.message) {
          // Single error message
          addNotification({
            type: 'error',
            title: 'Validation Error',
            message: error.response.data.message
          });
          return;
        }
      }
      
      // Generic error fallback
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'create'} dentist. Please try again.`
      });
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const loadingText = isEditing ? 'Updating...' : 'Creating...';
  const submitText = isEditing ? 'Update Dentist' : 'Create Dentist';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Dentist' : 'New Dentist'}</h2>
          <button
            className="close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="dentist-form">
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
                placeholder="Enter dentist name"
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
              <label htmlFor="phone">Phone *</label>
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
              <label htmlFor="licenseNumber">License Number (CRO) *</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className={errors.licenseNumber ? 'error' : ''}
                disabled={isLoading}
                placeholder="Enter CRO number"
              />
              {errors.licenseNumber && <span className="error-message">{errors.licenseNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Specialization *</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className={errors.specialization ? 'error' : ''}
                disabled={isLoading}
                placeholder="Enter specialization"
              />
              {errors.specialization && <span className="error-message">{errors.specialization}</span>}
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
