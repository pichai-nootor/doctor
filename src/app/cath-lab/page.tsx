'use client';

import CathLabTable from '@/components/CathLabTable';
import CathLabForm from '@/components/CathLabForm';
import { useState } from 'react';

export default function CathLabPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(undefined);
  };

  return (
    <main className="container mx-auto px-4 pt-0 pb-6 max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mt-[-8px]">
        <CathLabTable onEdit={handleEdit} onAddNew={() => setIsFormOpen(true)} />
      </div>

      {isFormOpen && (
        <CathLabForm 
          editingId={editingId} 
          onClose={handleCloseForm} 
        />
      )}
    </main>
  );
}
