import React, { useState } from 'react';
import { Customer } from '../../types';
import { CustomerList } from './CustomerList';
import { CustomerForm } from './CustomerForm';

export const CustomerManagement: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setEditingCustomer(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCustomer(undefined);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCustomer(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div>
      <CustomerList
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />
      
      <CustomerForm
        customer={editingCustomer}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};
