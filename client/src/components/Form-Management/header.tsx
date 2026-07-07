import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const dir = i18n.dir(); 

  return (
    <div dir={dir} className="flex flex-col gap-1 items-start">
      <h1 className="text-2xl font-bold text-slate-800 text-start">
        {t('formManagement.header.title', 'پرسشنامه‌های فعال')}
      </h1>
      <p className="text-xs text-slate-400 text-start">
        {t(
          'formManagement.header.description',
          'مدیریت و مشاهده پرسشنامه‌های طراحی شده',
        )}
      </p>
    </div>
  );
}
