import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

import { Button } from '../ui/Button';

type IconType = LucideIcon | ComponentType<{ className?: string }>;

export interface FormElementButtonProps {
  text: string;
  type: string;
  Icon: IconType;
}

export const FormElementButton = ({
  text,
  Icon,
  className = '',
}: FormElementButtonProps & { className?: string }) => (
  <Button
    type="button"
    variant="secondary"
    className={[
      'group h-auto min-h-[42px] w-full justify-start gap-2.5',
      'rounded-md border border-slate-200/90 bg-white px-2.5 py-2',
      'text-start shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
      'transition-all duration-150 ease-out',
      'hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm',
      'focus-visible:ring-2 focus-visible:ring-primary/30',
      className,
    ].join(' ')}
  >
    <Icon
      className={[
        'h-[17px] w-[17px] shrink-0',
        'text-slate-700 transition-colors duration-150',
        'group-hover:text-slate-950',
      ].join(' ')}
    />

    <span
      className={[
        'min-w-0 whitespace-normal break-words',
        'text-[12px] font-medium leading-[17px] text-slate-700',
        'transition-colors duration-150 group-hover:text-slate-950',
      ].join(' ')}
    >
      {text}
    </span>
  </Button>
);

export default function DraggableButton(props: FormElementButtonProps) {
  const { text, type } = props;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type,
    data: {
      element: {
        ...props,
        text,
        type,
      },
      text,
      type,
    },
  });

  return (
    <li
      ref={setNodeRef}
      className={[
        'list-none',
        isDragging ? 'opacity-50' : 'opacity-100',
      ].join(' ')}
      {...listeners}
      {...attributes}
    >
      <FormElementButton
        className="h-full cursor-grab select-none active:cursor-grabbing"
        {...props}
      />
    </li>
  );
}
