

export type FormStatus = 0 |1 | 2;

type Props = {
  value: FormStatus;
  onChange: (value: FormStatus) => void;
};

export default function FormStatusFilter({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-4 rounded-full  px-5 py-3 ">
      <span className="shrink-0 text-sm font-medium text-slate-600">
        فیلتر وضعیت:
      </span>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="radio"
          name="form-status"
          checked={value === 1}
          onChange={() => onChange(1)}
          className="h-4 w-4 accent-blue-600"
        />
        فعال
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="radio"
          name="form-status"
          checked={value === 0}
          onChange={() => onChange(0)}
          className="h-4 w-4 accent-blue-600"
        />
        غیرفعال
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input
          type="radio"
          name="form-status"
          checked={value === 2}
          onChange={() => onChange(2)}
          className="h-4 w-4 accent-blue-600"
        />
        هر دو
      </label>
    </div>
  );
}
