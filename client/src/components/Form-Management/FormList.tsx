import FormCard, { FormItem } from "./FormCard";
import { useNavigate } from 'react-router-dom';

type Props = {
  forms: FormItem[];
  onToggleStatus: (form: FormItem) => void;
};

export default function FormList({ forms, onToggleStatus }: Props) {
  const navigate = useNavigate();

  const sortedForms = [...forms].sort((a, b) => b.status - a.status);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedForms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onEdit={(f) => navigate(`/my-forms/${f.id}/edit`)}
          onView={(f) => navigate(`/my-forms/${f.id}/view`)}
          onToggleStatus={onToggleStatus} 
        />
      ))}
    </div>
  );
}
