
import React, { useState, useEffect } from 'react';
import { Dentist } from '../../types';
import { dentistService } from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { useLoading } from '../../hooks/useLoading';
import './DentistList.css';

interface DentistListProps {
  onCreateNew: () => void;
  onEdit?: (dentist: Dentist) => void;
  onDelete?: (dentistId: number) => void;
  refreshTrigger?: number;
}

export const DentistList: React.FC<DentistListProps> = ({
  onCreateNew,
  onEdit,
  onDelete,
  refreshTrigger
}) => {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const { addNotification } = useNotification();
  const { isLoading, withLoading } = useLoading();

  const fetchDentists = async (showLoading = true) => {
    try {
      const fetchOperation = async () => {
        const result = await dentistService.list(currentPage, pageSize, debouncedSearchTerm);
        setDentists(result.data || result.items || []);
        setTotalPages(Math.ceil((result.total || result.totalCount || 0) / pageSize));
      };
      if (showLoading) {
        await withLoading(fetchOperation());
      } else {
        await fetchOperation();
      }
    } catch (error) {
      console.error('Error fetching dentists:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dentists.'
      });
    }
  };

  const handleSoftDelete = async (dentist: Dentist) => {
    if (!window.confirm(`Are you sure you want to ${dentist.isActive ? 'deactivate' : 'activate'} Dr. ${dentist.name}?`)) {
      return;
    }

    try {
      const updateOperation = dentistService.update(dentist.id, {
        ...dentist,
        isActive: !dentist.isActive
      });
      
      await withLoading(updateOperation);

      addNotification({
        type: 'success',
        title: 'Success',
        message: `Dentist ${dentist.isActive ? 'deactivated' : 'activated'} successfully!`
      });

      if (onDelete) {
        onDelete(dentist.id);
      } else {
        fetchDentists(false);
      }
    } catch (error) {
      console.error('Error updating dentist:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to ${dentist.isActive ? 'deactivate' : 'activate'} dentist.`
      });
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchDentists(true);
  }, [currentPage, refreshTrigger]);

  useEffect(() => {
    fetchDentists(false);
  }, [debouncedSearchTerm]);

  return (
    <div className="dentist-list">
      <div className="dentist-list-header">
        <h2>Dentist Management</h2>
        <button
          className="create-button"
          onClick={onCreateNew}
          disabled={isLoading}
        >
          + New Dentist
        </button>
      </div>

      <div className="dentist-search">
        <form onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search dentists by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={isLoading}
          />
          <button type="button" className="search-button" disabled={isLoading}>
            Search
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="loading-indicator">
          <div className="loading-spinner">Loading dentists...</div>
        </div>
      )}

      {!isLoading && dentists.length === 0 && (
        <div className="empty-state">
          <p>No dentists found.</p>
          <button className="create-button" onClick={onCreateNew}>
            Create your first dentist
          </button>
        </div>
      )}

      {!isLoading && dentists.length > 0 && (
        <>
          <div className="dentist-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>CRO</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dentists.map((dentist) => (
                  <tr key={dentist.id}>
                    <td>{dentist.name}</td>
                    <td>{dentist.email}</td>
                    <td>{dentist.phone}</td>
                    <td>{dentist.licenseNumber}</td>
                    <td>{dentist.specialization}</td>
                    <td>
                      <span className={`status ${dentist.isActive ? 'active' : 'inactive'}`}>
                        {dentist.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => onEdit && onEdit(dentist)}
                          disabled={isLoading}
                          title="Edit dentist"
                        >
                          Edit
                        </button>
                        <button
                          className={`delete-button ${dentist.isActive ? 'deactivate' : 'activate'}`}
                          onClick={() => handleSoftDelete(dentist)}
                          disabled={isLoading}
                          title={dentist.isActive ? 'Deactivate dentist' : 'Activate dentist'}
                        >
                          {dentist.isActive ? 'Deactivate' : 'Activate'}
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
