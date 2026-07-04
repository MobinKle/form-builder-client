import * as React from 'react';

import { Button } from '@/components/ui/Button';
import CreateFormModal from '@/components/Form-Management/CreateFormModal';
import { CreateFormValues } from '@/components/Form-Management/CreateFormModal.form';

export default function FormManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateForm = async (values: CreateFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('create form values:', values);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="p-6">
      <Button onClick={() => setIsCreateModalOpen(true)}>
        + ایجاد پرسشنامه جدید
      </Button>

      <CreateFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateForm}
        isLoading={isSubmitting}
      />
    </div>
  );
}




