import * as React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  field?: ControllerRenderProps<FieldValues, string>;
}

const formatPersianDate = (value?: Date | string | null) => {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const formatGregorianDate = (value?: Date | string | null) => {
  if (!value) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export function DatePicker({ className, field }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  React.useEffect(() => {
    if (!field?.value) {
      setSelectedDate(undefined);
      return;
    }

    const value =
      field.value instanceof Date ? field.value : new Date(field.value);

    setSelectedDate(Number.isNaN(value.getTime()) ? undefined : value);
  }, [field?.value]);

  const formattedDate = selectedDate
    ? isRtl
      ? formatPersianDate(selectedDate)
      : formatGregorianDate(selectedDate)
    : '';

  return (
    <div className={cn('grid gap-2', className)} dir={isRtl ? 'rtl' : 'ltr'}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'w-[300px] justify-start font-normal',
              isRtl ? 'text-right' : 'text-left',
              !selectedDate && 'text-muted-foreground',
            )}
          >
            {formattedDate ? (
              <span>{formattedDate}</span>
            ) : (
              <span>{t('formBuilder.selectDate', 'تاریخ را انتخاب کنید')}</span>
            )}
            <CalendarDaysIcon
              className={cn('h-4 w-4', isRtl ? 'mr-auto' : 'ml-auto')}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={value => {
              setSelectedDate(value);
              field?.onChange(value ?? null);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
