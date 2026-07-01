import * as React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  field?: ControllerRenderProps<FieldValues, string>;
}

const formatPersianDate = (date?: Date) => {
  if (!date) return '';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export function DateRangePicker({ className, field }: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  React.useEffect(() => {
    setDate(field?.value ?? undefined);
  }, [field?.value]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-right font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {formatPersianDate(date.from)} - {formatPersianDate(date.to)}
                </>
              ) : (
                formatPersianDate(date.from)
              )
            ) : (
              <span>انتخاب بازه تاریخ</span>
            )}

            <CalendarDaysIcon className="mr-auto h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            captionLayout="dropdown"
            fromYear={1960}
            toYear={2030}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={value => {
              setDate(value);
              field?.onChange(value);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
