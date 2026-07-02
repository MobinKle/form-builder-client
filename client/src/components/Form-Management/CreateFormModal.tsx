import * as React from 'react';
import { CalendarIcon, ChevronDown, X } from 'lucide-react';

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

import {
  centerOptions,
  createFormInitialValues,
  CreateFormValues,
  organizationOptions,
  registrarOptions,
  responderOptions,
  SelectOption,
  structureOptions,
  validateCreateForm,
} from './CreateFormModal.form';

type CreateFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (values: CreateFormValues) => void | Promise<void>;
  isLoading?: boolean;
};

type FormErrors = Partial<Record<keyof CreateFormValues, string>>;

const formatPersianDate = (date?: Date) => {
  if (!date) return '';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function RequiredMark() {
  return <span className="mr-1 text-destructive">*</span>;
}

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
};

function TextInput({
  label,
  error,
  required,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-right text-sm font-medium text-foreground">
        {label}
        {required && <RequiredMark />}
      </label>

      <input
        className={cn(
          'h-10 w-full rounded-md border border-input bg-background px-3 text-right text-sm outline-none transition-colors',
          'placeholder:text-muted-foreground',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          error && 'border-destructive focus:border-destructive focus:ring-destructive',
          className,
        )}
        {...props}
      />

      <FieldError message={error} />
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
};

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  required,
}: SelectFieldProps) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-right text-sm font-medium text-foreground">
        {label}
        {required && <RequiredMark />}
      </label>

      <div className="relative">
        <select
          dir="rtl"
          value={value}
          onChange={event => onChange(event.target.value)}
          className={cn(
            'h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pl-9 text-right text-sm outline-none transition-colors',
            'text-foreground focus:border-primary focus:ring-1 focus:ring-primary',
            !value && 'text-muted-foreground',
            error && 'border-destructive focus:border-destructive focus:ring-destructive',
          )}
        >
          <option value="">{placeholder}</option>

          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <FieldError message={error} />
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
};

function DatePickerField({
  label,
  value,
  placeholder,
  onChange,
  error,
  required,
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
      <label className="mb-2 block text-right text-sm font-medium text-foreground">
        {label}
        {required && <RequiredMark />}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors',
          'focus:border-primary focus:ring-1 focus:ring-primary',
          error && 'border-destructive focus:border-destructive focus:ring-destructive',
        )}
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />

        <span
          className={cn(
            'text-right',
            value ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {value ? formatPersianDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[70] rounded-lg border bg-background shadow-lg">
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

      <FieldError message={error} />
    </div>
  );
}

export function CreateFormModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateFormModalProps) {
  const [values, setValues] = React.useState<CreateFormValues>(
    createFormInitialValues,
  );
  const [errors, setErrors] = React.useState<FormErrors>({});

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
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateCreateForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit?.(values);

    handleOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        dir="rtl"
        className={cn(
          'max-h-[92vh] w-[calc(100%-32px)] max-w-[560px] overflow-y-auto rounded-2xl border-none bg-background p-0 shadow-2xl',
          'sm:rounded-2xl',
        )}
      >
        <div className="relative px-6 pb-6 pt-7 sm:px-8">
          <AlertDialogCancel
            className={cn(
              'absolute left-5 top-5 mt-0 h-8 w-8 rounded-full border-0 bg-transparent p-0 shadow-none',
              'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">بستن</span>
          </AlertDialogCancel>

          <div className="mb-6 text-center">
            <AlertDialogTitle className="text-xl font-bold text-foreground">
              ایجاد پرسشنامه جدید
            </AlertDialogTitle>

            <AlertDialogDescription className="sr-only">
              فرم ایجاد پرسشنامه جدید شامل عنوان، پاسخ‌دهنده، ثبت‌کننده،
              تاریخ‌ها، مرکز، سازمان و ساختار
            </AlertDialogDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="flex cursor-pointer items-center justify-end gap-2 text-sm text-foreground">
              <span>اجباری</span>

              <input
                type="checkbox"
                checked={values.isRequired}
                onChange={event =>
                  updateValue('isRequired', event.target.checked)
                }
                className="h-4 w-4 cursor-pointer rounded border-input accent-primary"
              />
            </label>

            <TextInput
              required
              label="عنوان پرسشنامه"
              placeholder="عنوان پرسشنامه را وارد کنید"
              value={values.title}
              error={errors.title}
              onChange={event => updateValue('title', event.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                required
                label="پاسخ‌دهنده"
                placeholder="انتخاب کنید"
                value={values.responder}
                options={responderOptions}
                error={errors.responder}
                onChange={value => updateValue('responder', value)}
              />

              <SelectField
                required
                label="ثبت‌کننده"
                placeholder="انتخاب کنید"
                value={values.registrar}
                options={registrarOptions}
                error={errors.registrar}
                onChange={value => updateValue('registrar', value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DatePickerField
                required
                label="تاریخ شروع"
                placeholder="انتخاب تاریخ"
                value={values.startDate}
                error={errors.startDate}
                onChange={date => updateValue('startDate', date)}
              />

              <DatePickerField
                required
                label="تاریخ پایان"
                placeholder="انتخاب تاریخ"
                value={values.endDate}
                error={errors.endDate}
                onChange={date => updateValue('endDate', date)}
              />
            </div>

            <SelectField
              required
              label="مرکز"
              placeholder="انتخاب مرکز"
              value={values.center}
              options={centerOptions}
              error={errors.center}
              onChange={value => updateValue('center', value)}
            />

            <SelectField
              required
              label="سازمان"
              placeholder="انتخاب سازمان"
              value={values.organization}
              options={organizationOptions}
              error={errors.organization}
              onChange={value => updateValue('organization', value)}
            />

            <SelectField
              required
              label="ساختار"
              placeholder="انتخاب ساختار"
              value={values.structure}
              options={structureOptions}
              error={errors.structure}
              onChange={value => updateValue('structure', value)}
            />

            <div className="flex items-center justify-start gap-3 pt-3">
              <Button
                type="submit"
                isLoading={isLoading}
                className="h-10 min-w-[132px] rounded-lg bg-blue-600 px-5 hover:bg-blue-700"
              >
                ایجاد پرسشنامه
              </Button>

              <AlertDialogCancel
                className={cn(
                  'mt-0 h-10 rounded-lg border border-input bg-background px-5 text-sm font-medium shadow-none',
                  'hover:bg-secondary hover:text-foreground',
                )}
              >
                انصراف
              </AlertDialogCancel>
            </div>
          </form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateFormModal;
