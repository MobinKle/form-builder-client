import { useTranslation } from 'react-i18next';

type Props = {
  onClick: () => void;
};

export default function CreateFormCard({ onClick }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  return (
    <button
      type="button"
      onClick={onClick}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex h-[280px] w-[240px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-500 hover:bg-blue-50/40"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-5xl font-light text-white">
        +
      </div>

      <div className="mt-5 text-lg font-bold text-blue-600">
        {t('formManagement.createNewForm', 'ایجاد پرسشنامه جدید')}
      </div>

      <p className="mt-2 px-6 text-center text-sm text-slate-400">
        {t(
          'formManagement.createNewFormDescription',
          'برای شروع، یک پرسشنامه جدید ایجاد کنید',
        )}
      </p>
    </button>
  );
}
