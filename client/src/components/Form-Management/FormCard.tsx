import { useTranslation } from 'react-i18next';

const formatDate = (date: Date | undefined, isRtl: boolean) => {
  if (!date) return '';

  return new Intl.DateTimeFormat(isRtl ? 'fa-IR-u-ca-persian' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export type FormItem = {
  id: string;
  title: string;
  status: number;
  respondent: string;
  creator: string;
  startDate: string;
  endDate: string;
};

type Props = {
  form: FormItem;
  onView?: (form: FormItem) => void;
  onEdit?: (form: FormItem) => void;
  onDelete?: (form: FormItem) => void;
};

export default function FormCard({
  form,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  const startDate = form.startDate ? new Date(form.startDate) : undefined;
  const endDate = form.endDate ? new Date(form.endDate) : undefined;
  const isActive = form.status === 1;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">{form.title}</h3>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {isActive
            ? t('formManagement.status.active', 'فعال')
            : t('formManagement.status.inactive', 'غیرفعال')}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-xs text-slate-500">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">
            {t('formManagement.respondent', 'پاسخ دهنده:')}
          </span>
          <span className="font-medium text-slate-700">{form.respondent}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">
            {t('formManagement.creator', 'ثبت کننده:')}
          </span>
          <span className="font-medium text-slate-700">{form.creator}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">
            {t('formManagement.startDate', 'تاریخ شروع:')}
          </span>
          <span className="font-medium text-slate-700">
            {formatDate(startDate, isRtl)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">
            {t('formManagement.endDate', 'تاریخ پایان:')}
          </span>
          <span className="font-medium text-slate-700">
            {formatDate(endDate, isRtl)}
          </span>
        </div>
      </div>

      <div
        className={`mt-5 flex items-center border-t border-slate-100 pt-3 text-xs font-medium ${
          isRtl ? 'justify-between' : 'justify-between'
        }`}
      >
        <button
          type="button"
          onClick={() => onView?.(form)}
          className="flex items-center gap-1.5 text-emerald-600 transition-colors hover:text-emerald-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z"
            />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <span>{t('common.view', 'نمایش')}</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit?.(form)}
          className="flex items-center gap-1.5 text-blue-600 transition-colors hover:text-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          <span>{t('common.edit', 'ویرایش')}</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(form)}
          className="flex items-center gap-1.5 text-red-500 transition-colors hover:text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2.75v8.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.05 5.636a7 7 0 1 0 9.9 0"
            />
          </svg>

          <span>
            {isActive
              ? t('formManagement.deactivate', 'غیرفعال‌سازی')
              : t('formManagement.activate', 'فعال‌سازی')}
          </span>
        </button>
      </div>
    </div>
  );
}
