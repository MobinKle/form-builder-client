import * as React from "react";
import Header from "@/components/Form-Management/header";
import FormStatusFilter, { FormStatus } from "@/components/Form-Management/FormStatusFilter";
import FormList from "@/components/Form-Management/FormList";
import CreateFormModal from "@/components/Form-Management/CreateFormModal";
import { CreateFormValues } from "@/components/Form-Management/CreateFormModal.form";
import { getFormList, FormItem } from "@/services/FormListApi";

export default function FormManagement() 
{
  const [status, setStatus] = React.useState<FormStatus>(2);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [forms, setForms] = React.useState<FormItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchForms = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFormList();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleCreateForm = async (values: CreateFormValues) => {
    setIsSubmitting(true);

    try 
    {
      console.log("create form values:", values);

      // API ساخت فرم می تواند این جا صدا زده شود

      setIsCreateModalOpen(false);

     // لیست دوباره باید خواندده شود
      await fetchForms();
    } 
    catch (error) 
    {
      console.error("Error creating form:", error);
    } 
    finally
    {
      setIsSubmitting(false);
    }
  };

  const filteredForms = React.useMemo(() => {
    if (status === 2) return forms;
    return forms.filter((f) => f.status === status);
  }, [forms, status]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F7F9] px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-4">
          <Header />

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>ایجاد پرسشنامه جدید</span>
          </button>
        </div>

        <div className="my-6 h-px w-full bg-slate-200" />

        <div className="mt-6 flex items-center justify-between gap-4">
          <FormStatusFilter value={status} onChange={setStatus} />
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <span className="mr-3 text-slate-600">در حال دریافت اطلاعات...</span>
            </div>
          ) : (
            <FormList forms={filteredForms} />
          )}
        </div>

        <CreateFormModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateForm}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
