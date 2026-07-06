
import FormCard, { FormItem } from "./FormCard";

type Props = {
  forms: FormItem[];
};

export default function FormList({ forms }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          onView={(f) => console.log("view", f)}
          onEdit={(f) => console.log("edit", f)}
          onDelete={(f) => console.log("delete", f)}
        />
      ))}
    </div>
  );
}
