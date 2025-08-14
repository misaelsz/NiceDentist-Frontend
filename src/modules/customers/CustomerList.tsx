import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { customerService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { useLoading } from '../../hooks/useLoading';
import './CustomerList.css';

interface CustomerListProps {
  onCreateNew: () => void;
  onEdit: (customer: Customer) => void;
  refreshTrigger?: number;
}

export const CustomerList: React.FC<CustomerListProps> = ({ 
  onCreateNew, 
  onEdit,
  refreshTrigger 
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const { addNotification } = useNotification();
  const { isLoading, withLoading } = useLoading();

  const fetchCustomers = async () => {
    try {
      const result = await customerService.getAll(currentPage, pageSize, searchTerm);
      setCustomers(result.data || result.items || []);
      setTotalPages(Math.ceil((result.total || result.totalCount || 0) / pageSize));
    } catch (error) {
      console.error('Error fetching customers:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load customers.'
      });
    }
  };

  useEffect(() => {
    withLoading(fetchCustomers());
  }, [currentPage, searchTerm, refreshTrigger]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    withLoading(fetchCustomers());
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      return;
    }

    try {
      await withLoading(customerService.delete(id));
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Customer deleted successfully.'
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete customer.'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h2>Customer Management (Live Reload!)</h2>
        <button 
          className="create-button" 
          onClick={onCreateNew}
          disabled={isLoading}
        >
          + New Customer
        </button>
      </div>

      <div className="customer-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={isLoading}
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            Search
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner">Loading customers...</div>
        </div>
      )}

      {!isLoading && customers.length === 0 && (
        <div className="empty-state">
          <p>No customers found.</p>
          <button className="create-button" onClick={onCreateNew}>
            Create your first customer
          </button>
        </div>
      )}

      {!isLoading && customers.length > 0 && (
        <>
          <div className="customer-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      {customer.dateOfBirth 
                        ? formatDate(customer.dateOfBirth)
                        : 'Not provided'
                      }
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>
                      <span className={`status ${customer.isActive ? 'active' : 'inactive'}`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => onEdit(customer)}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(customer.id, customer.name)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="pagination-button"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isLoading}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
