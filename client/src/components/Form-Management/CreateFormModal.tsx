import * as React from 'react';
import { CalendarIcon, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { cn } from '@/lib/utils';
import { getCreateFormOptions } from '@/services/formManagementModalOption';

import {
  createFormInitialValues,
  CreateFormValues,
  SelectOption,
  validateCreateForm,
} from './CreateFormModal.form';

type CreateFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: CreateFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

type FormErrors = Partial<Record<keyof CreateFormValues, string>>;

const formatDate = (date: Date | undefined, isRtl: boolean) => {
  if (!date) return '';

  return new Intl.DateTimeFormat(isRtl ? 'fa-IR-u-ca-persian' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

function FieldError({
  message,
  isRtl,
}: {
  message?: string;
  isRtl: boolean;
}) {
  if (!message) return null;

  return (
    <p
      className={cn(
        'mt-1 text-xs text-destructive',
        isRtl ? 'text-right' : 'text-left',
      )}
    >
      {message}
    </p>
  );
}

function RequiredMark({ isRtl }: { isRtl: boolean }) {
  return (
    <span className={cn('text-destructive', isRtl ? 'mr-1' : 'ml-1')}>
      *
    </span>
  );
}

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
  isRtl: boolean;
};

function TextInput({
  label,
  error,
  required,
  className,
  isRtl,
  ...props
}: TextInputProps) {
  return (
    <div className="w-full">
      <label
        className={cn(
          'mb-2 block text-sm font-medium text-foreground',
          isRtl ? 'text-right' : 'text-left',
        )}
      >
        {label}
        {required && <RequiredMark isRtl={isRtl} />}
      </label>

      <input
        dir={isRtl ? 'rtl' : 'ltr'}
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors',
          'placeholder:text-muted-foreground',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          isRtl ? 'text-right' : 'text-left',
          error &&
            'border-destructive focus:border-destructive focus:ring-destructive',
          className,
        )}
        {...props}
      />

      <FieldError message={error} isRtl={isRtl} />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  isRtl: boolean;
  disabled?: boolean;
};

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  required,
  isRtl,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      <label
        className={cn(
          'mb-2 block text-sm font-medium text-foreground',
          isRtl ? 'text-right' : 'text-left',
        )}
      >
        {label}
        {required && <RequiredMark isRtl={isRtl} />}
      </label>

      <div className="relative">
        <select
          dir={isRtl ? 'rtl' : 'ltr'}
          value={value}
          disabled={disabled}
          onChange={event => onChange(event.target.value)}
          className={cn(
            'h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors',
            'text-foreground focus:border-primary focus:ring-1 focus:ring-primary',
            isRtl ? 'pl-9 text-right' : 'pr-9 text-left',
            !value && 'text-muted-foreground',
            disabled && 'cursor-not-allowed opacity-60',
            error &&
              'border-destructive focus:border-destructive focus:ring-destructive',
          )}
        >
          <option value="">{placeholder}</option>

          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className={cn(
            'pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
            isRtl ? 'left-3' : 'right-3',
          )}
        />
      </div>

      <FieldError message={error} isRtl={isRtl} />
    </div>
  );
}

type DatePickerFieldProps = {
  label: string;
  value?: Date;
  placeholder: string;
  onChange: (date?: Date) => void;
  error?: string;
  required?: boolean;
  isRtl: boolean;
};

function DatePickerField({
  label,
  value,
  placeholder,
  onChange,
  error,
  required,
  isRtl,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        className={cn(
          'mb-2 block text-sm font-medium text-foreground',
          isRtl ? 'text-right' : 'text-left',
        )}
      >
        {label}
        {required && <RequiredMark isRtl={isRtl} />}
      </label>

      <button
        type="button"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          error &&
            'border-destructive focus:border-destructive focus:ring-destructive',
        )}
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />

        <span
          className={cn(
            value ? 'text-foreground' : 'text-muted-foreground',
            isRtl ? 'text-right' : 'text-left',
          )}
        >
          {value ? formatDate(value, isRtl) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute top-[calc(100%+8px)] z-[70] rounded-lg border bg-background shadow-lg',
            isRtl ? 'right-0' : 'left-0',
          )}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={date => {
              onChange(date);
              setIsOpen(false);
            }}
          />
        </div>
      )}

      <FieldError message={error} isRtl={isRtl} />
    </div>
  );
}

export function CreateFormModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateFormModalProps) {
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language === 'fa';

  const [values, setValues] = React.useState<CreateFormValues>(
    createFormInitialValues,
  );
  const [errors, setErrors] = React.useState<FormErrors>({});

  const [responderOptions, setResponderOptions] = React.useState<
    SelectOption[]
  >([]);
  const [registrarOptions, setRegistrarOptions] = React.useState<
    SelectOption[]
  >([]);
  const [centerOptions, setCenterOptions] = React.useState<SelectOption[]>([]);
  const [organizationOptions, setOrganizationOptions] = React.useState<
    SelectOption[]
  >([]);
  const [structureOptions, setStructureOptions] = React.useState<
    SelectOption[]
  >([]);

  const [optionsLoading, setOptionsLoading] = React.useState(false);
  const [optionsError, setOptionsError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    async function fetchCreateFormOptions() {
      try {
        setOptionsLoading(true);
        setOptionsError('');

        const options = await getCreateFormOptions(i18n.language);

        if (!isMounted) return;

        setResponderOptions(options.responderOptions);
        setRegistrarOptions(options.registrarOptions);
        setCenterOptions(options.centerOptions);
        setOrganizationOptions(options.organizationOptions);
        setStructureOptions(options.structureOptions);
      } catch {
        if (!isMounted) return;

        setOptionsError(
          t('createForm.optionsFetchError', 'خطا در دریافت اطلاعات فرم'),
        );
      } finally {
        if (isMounted) {
          setOptionsLoading(false);
        }
      }
    }

    if (open) {
      fetchCreateFormOptions();
    }

    return () => {
      isMounted = false;
    };
  }, [open, i18n.language, t]);

  const updateValue = <Key extends keyof CreateFormValues>(
    key: Key,
    value: CreateFormValues[Key],
  ) => {
    setValues(prev => ({
      ...prev,
      [key]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const resetForm = () => {
    setValues(createFormInitialValues);
    setErrors({});
    setOptionsError('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateCreateForm(values, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit?.(values);

    handleOpenChange(false);
  };

  const selectPlaceholder = optionsLoading
    ? t('common.loading', 'در حال بارگذاری...')
    : t('common.select', 'انتخاب کنید');

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        dir={isRtl ? 'rtl' : 'ltr'}
        className={cn(
          'max-h-[92vh] w-[calc(100%-32px)] max-w-[560px] overflow-y-auto rounded-2xl border-none bg-background p-0 shadow-2xl',
          'sm:rounded-2xl',
        )}
      >
        <div className="relative px-6 pb-6 pt-7 sm:px-8">
          <AlertDialogCancel
            className={cn(
              'absolute top-5 mt-0 h-8 w-8 rounded-full border-0 bg-transparent p-0 shadow-none',
              'text-muted-foreground hover:bg-secondary hover:text-foreground',
              isRtl ? 'left-5' : 'right-5',
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t('common.close', 'بستن')}</span>
          </AlertDialogCancel>

          <div className="mb-6 text-center">
            <AlertDialogTitle className="text-xl font-bold text-foreground">
              {t('createForm.title', 'ایجاد پرسشنامه جدید')}
            </AlertDialogTitle>

            <AlertDialogDescription className="sr-only">
              {t(
                'createForm.description',
                'فرم ایجاد پرسشنامه جدید شامل عنوان، پاسخ‌دهنده، ثبت‌کننده، تاریخ‌ها، مرکز، سازمان و ساختار',
              )}
            </AlertDialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label
              className={cn(
                'flex cursor-pointer items-center gap-2 text-sm text-foreground',
                isRtl ? 'justify-end' : 'justify-start',
              )}
            >
              <span>{t('formBuilder.required', 'اجباری')}</span>

              <input
                type="checkbox"
                checked={values.isRequired}
                onChange={event =>
                  updateValue('isRequired', event.target.checked)
                }
                className="h-4 w-4 cursor-pointer rounded border-input accent-primary"
              />
            </label>

            {optionsError && (
              <p
                className={cn(
                  'rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive',
                  isRtl ? 'text-right' : 'text-left',
                )}
              >
                {optionsError}
              </p>
            )}

            <TextInput
              required
              isRtl={isRtl}
              label={t('createForm.questionnaireTitle', 'عنوان پرسشنامه')}
              placeholder={t(
                'createForm.enterQuestionnaireTitle',
                'عنوان پرسشنامه را وارد کنید',
              )}
              value={values.title}
              error={errors.title}
              onChange={event => updateValue('title', event.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                required
                isRtl={isRtl}
                disabled={optionsLoading}
                label={t('createForm.responder', 'پاسخ‌دهنده')}
                placeholder={selectPlaceholder}
                value={values.responder}
                options={responderOptions}
                error={errors.responder}
                onChange={value => updateValue('responder', value)}
              />

              <SelectField
                required
                isRtl={isRtl}
                disabled={optionsLoading}
                label={t('createForm.registrar', 'ثبت‌کننده')}
                placeholder={selectPlaceholder}
                value={values.registrar}
                options={registrarOptions}
                error={errors.registrar}
                onChange={value => updateValue('registrar', value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DatePickerField
                required
                isRtl={isRtl}
                label={t('createForm.startDate', 'تاریخ شروع')}
                placeholder={t('createForm.selectDate', 'انتخاب تاریخ')}
                value={values.startDate}
                error={errors.startDate}
                onChange={date => updateValue('startDate', date)}
              />

              <DatePickerField
                required
                isRtl={isRtl}
                label={t('createForm.endDate', 'تاریخ پایان')}
                placeholder={t('createForm.selectDate', 'انتخاب تاریخ')}
                value={values.endDate}
                error={errors.endDate}
                onChange={date => updateValue('endDate', date)}
              />
            </div>

            <SelectField
              required
              isRtl={isRtl}
              disabled={optionsLoading}
              label={t('createForm.center', 'مرکز')}
              placeholder={
                optionsLoading
                  ? t('common.loading', 'در حال بارگذاری...')
                  : t('createForm.selectCenter', 'انتخاب مرکز')
              }
              value={values.center}
              options={centerOptions}
              error={errors.center}
              onChange={value => updateValue('center', value)}
            />

            <SelectField
              required
              isRtl={isRtl}
              disabled={optionsLoading}
              label={t('createForm.organization', 'سازمان')}
              placeholder={
                optionsLoading
                  ? t('common.loading', 'در حال بارگذاری...')
                  : t('createForm.selectOrganization', 'انتخاب سازمان')
              }
              value={values.organization}
              options={organizationOptions}
              error={errors.organization}
              onChange={value => updateValue('organization', value)}
            />

            <SelectField
              required
              isRtl={isRtl}
              disabled={optionsLoading}
              label={t('createForm.structure', 'ساختار')}
              placeholder={
                optionsLoading
                  ? t('common.loading', 'در حال بارگذاری...')
                  : t('createForm.selectStructure', 'انتخاب ساختار')
              }
              value={values.structure}
              options={structureOptions}
              error={errors.structure}
              onChange={value => updateValue('structure', value)}
            />

            <div
              className={cn(
                'flex items-center gap-3 pt-3',
                isRtl ? 'justify-start' : 'justify-end',
              )}
            >
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={optionsLoading}
                className="h-10 min-w-[132px] rounded-lg bg-blue-600 px-5 hover:bg-blue-700"
              >
                {t('createForm.createQuestionnaire', 'ایجاد پرسشنامه')}
              </Button>

              <AlertDialogCancel
                className={cn(
                  'mt-0 h-10 rounded-lg border border-input bg-background px-5 text-sm font-medium shadow-none',
                  'hover:bg-secondary hover:text-foreground',
                )}
              >
                {t('common.cancel', 'انصراف')}
              </AlertDialogCancel>
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateFormModal;
