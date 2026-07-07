import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker as GregorianDayPicker } from 'react-day-picker';
import { DayPicker as PersianDayPicker } from 'react-day-picker/persian';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/Button';

type BaseCalendarProps = React.ComponentProps<typeof GregorianDayPicker>;

export type CalendarProps = BaseCalendarProps & {
  isRtl?: boolean;
};

const persianCaptionFormatter = new Intl.DateTimeFormat(
  'fa-IR-u-ca-persian',
  {
    year: 'numeric',
    month: 'long',
  },
);

const gregorianCaptionFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
});

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  formatters,
  isRtl = false,
  ...props
}: CalendarProps) {
  const DayPickerComponent = isRtl ? PersianDayPicker : GregorianDayPicker;

  return (
    <DayPickerComponent
      showOutsideDays={showOutsideDays}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn('p-3', className)}
      formatters={{
        formatCaption: date =>
          isRtl
            ? persianCaptionFormatter.format(date)
            : gregorianCaptionFormatter.format(date),
        ...formatters,
      }}
      classNames={{
        months: cn(
          'flex flex-col sm:flex-row space-y-4 sm:space-y-0',
          isRtl
            ? 'sm:space-x-4 sm:space-x-reverse'
            : 'sm:space-x-4',
        ),
        month: 'space-y-4',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: cn(
          'space-x-1 flex items-center',
          isRtl && 'space-x-reverse',
        ),
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          isRtl ? 'right-1' : 'left-1',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          isRtl ? 'left-1' : 'right-1',
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-secondary text-secondary-foreground',
        outside: 'text-muted-foreground opacity-50',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className }) => {
          if (orientation === 'left') {
            return isRtl ? (
              <ChevronRight className={cn('h-4 w-4', className)} />
            ) : (
              <ChevronLeft className={cn('h-4 w-4', className)} />
            );
          }

          if (orientation === 'right') {
            return isRtl ? (
              <ChevronLeft className={cn('h-4 w-4', className)} />
            ) : (
              <ChevronRight className={cn('h-4 w-4', className)} />
            );
          }

          return <ChevronLeft className={cn('h-4 w-4', className)} />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
