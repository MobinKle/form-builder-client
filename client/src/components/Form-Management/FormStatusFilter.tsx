import { useTranslation } from 'react-i18next';

export type FormStatus = 0 | 1 | 2;

type Props = {
  value: FormStatus;
  onChange: (value: FormStatus) => void;
};

export default function FormStatusFilter({ value, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  const OPTIONS: Array<{
    value: FormStatus;
    label: string;
    tone: 'green' | 'slate' | 'blue';
  }> = [
    {
      value: 1,
      label: t('formManagement.status.active', 'فعال'),
      tone: 'green',
    },
    {
      value: 0,
      label: t('formManagement.status.inactive', 'غیرفعال'),
      tone: 'slate',
    },
    {
      value: 2,
      label: t('formManagement.status.both', 'هر دو'),
      tone: 'blue',
    },
  ];

  return (
    <fieldset dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-xl">
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-sm font-semibold text-slate-700">
          {t('formManagement.statusFilter', 'فیلتر وضعیت:')}
        </span>

        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          {OPTIONS.map((opt) => {
            const active = value === opt.value;

            const activeClass =
              opt.tone === 'green'
                ? 'bg-emerald-600 text-white shadow-sm'
                : opt.tone === 'blue'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-700 text-white shadow-sm';

            const inactiveClass =
              'text-slate-600 hover:bg-slate-50 hover:text-slate-800';

            return (
              <label
                key={opt.value}
                className={[
                  'relative cursor-pointer select-none rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600/30',
                  active ? activeClass : inactiveClass,
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="form-status"
                  value={opt.value}
                  checked={active}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />

                <span className="inline-flex items-center gap-2">
                  <span
                    className={[
                      'h-2 w-2 rounded-full',
                      active ? 'bg-white/90' : 'bg-slate-300',
                    ].join(' ')}
                  />
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
