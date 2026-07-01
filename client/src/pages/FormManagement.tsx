import { useTranslation } from 'react-i18next';

export default function FormManagement() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold">

        {t('Form Management')}
      </h1>
      
      <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
        <p className="text-gray-500">
          {t('This page is currently under development.')}
        </p>
      </div>
    </div>
  );
}
