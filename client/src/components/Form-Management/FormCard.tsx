import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import StatusBadge from '../ui/StatusBadge';
import InfoRow from '../ui/InfoRow';
import ActionButton from '../ui/ActionButton';

import { EyeSvg, PencilSvg, PowerSvg } from '../../assets/icons/Svgs';

import FormStatusDialog from '../ui/FormStatusDialog';

const toPersianDigits = (value: string) => {
  return value.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
};

const formatDate = (date: string | undefined, isRtl: boolean) => {
  if (!date) return '';
  return isRtl ? toPersianDigits(date) : date;
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
  onToggleStatus?: (form: FormItem) => void;
};

export default function FormCard({
  form,
  onView,
  onEdit,
  onToggleStatus,
}: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const isActive = form.status === 1;
  const isDraft = form.status === 3;

const statusLabel = t('formManagement.deactivate', 'غیرفعال‌سازی');

  const handleStatusChange = () => {
    console.log(
      isDraft
        ? 'Draft form action:'
        : isActive
          ? 'Deactivate form:'
          : 'Activate form:',
      form
    );

    onToggleStatus?.(form);
    setIsStatusModalOpen(false);
  };

  return (
    <>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-800">
            {form.title}
          </h3>

<StatusBadge
  active={isActive}
  draft={isDraft}
  activeText={t('formManagement.status.active', 'فعال')}
  inactiveText={t('formManagement.status.inactive', 'غیرفعال')}
  draftText={t('formManagement.status.draft', 'ثبت اولیه')}
/>

        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-500">
          <InfoRow
            label={t('formManagement.respondent', 'پاسخ دهنده:')}
            value={form.respondent}
          />

          <InfoRow
            label={t('formManagement.creator', 'ثبت کننده:')}
            value={form.creator}
          />

          <InfoRow
            label={t('formManagement.startDate', 'تاریخ شروع:')}
            value={formatDate(form.startDate, isRtl)}
          />

          <InfoRow
            label={t('formManagement.endDate', 'تاریخ پایان:')}
            value={formatDate(form.endDate, isRtl)}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium">
          <ActionButton
            label={t('common.view', 'نمایش')}
            icon={<EyeSvg className="h-4 w-4" />}
            color="emerald"
            onClick={() => onView?.(form)}
          />

          <ActionButton
            label={t('common.edit', 'ویرایش')}
            icon={<PencilSvg className="h-4 w-4" />}
            color="blue"
            onClick={() => onEdit?.(form)}
          />

          <ActionButton
            label={statusLabel}
            icon={<PowerSvg className="h-4 w-4" />}
            color="red"
            onClick={() => setIsStatusModalOpen(true)}
          />
        </div>
      </div>

      <FormStatusDialog
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        isRtl={isRtl}
        title={statusLabel}
        description={t(
                  'formManagement.activateConfirm',
                  'آیا از فعال‌سازی این فرم مطمئن هستید؟'
                )
        }
        actionLabel={statusLabel}
        cancelLabel={t('common.cancel', 'انصراف')}
        onConfirm={handleStatusChange}
      />
    </>
  );
}
