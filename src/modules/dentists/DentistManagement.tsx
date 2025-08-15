
import React, { useState } from 'react';
import { Dentist } from '../../types';
import { DentistList } from './DentistList';
import { DentistForm } from './DentistForm';

export const DentistManagement: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDentist, setEditingDentist] = useState<Dentist | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setEditingDentist(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (dentist: Dentist) => {
    setEditingDentist(dentist);
    setIsFormOpen(true);
  };

  const handleDelete = (dentistId: number) => {
    // Refresh the list after soft delete
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDentist(undefined);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingDentist(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <DentistList
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
      />
      <DentistForm
        dentist={editingDentist}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
