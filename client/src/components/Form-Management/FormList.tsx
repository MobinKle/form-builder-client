
import FormCard, { FormItem } from "./FormCard";
import { useNavigate, useSearchParams } from 'react-router-dom';

type Props = {
  forms: FormItem[];
};

export default function FormList({ forms }: Props) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onEdit={(form) => navigate(`/my-forms/${form.id}/edit`) }
          onView={(form) => navigate(`/my-forms/${form.id}/view`)}
          onDelete={(f) => console.log("delete", f)}
        />
      ))}
    </div>
  );
}
