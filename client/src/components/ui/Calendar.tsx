import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker/persian';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/Button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const persianCaptionFormatter = new Intl.DateTimeFormat(
  'fa-IR-u-ca-persian',
  {
    year: 'numeric',
    month: 'long',
  },
);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  formatters,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      dir="rtl"
      className={cn('p-3', className)}
      formatters={{
        formatCaption: date => persianCaptionFormatter.format(date),
        ...formatters,
      }}
      classNames={{
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-x-reverse sm:space-y-0',
        month: 'space-y-4',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 space-x-reverse flex items-center',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
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
            return <ChevronRight className={cn('h-4 w-4', className)} />;
          }

          if (orientation === 'right') {
            return <ChevronLeft className={cn('h-4 w-4', className)} />;
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
