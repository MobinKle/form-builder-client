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
    className={`w-full gap-3 transition-all duration-200 hover:shadow ${className}`}
  >
    <Icon className="h-[18px] w-[18px]" />
    <span>{text}</span>
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
      className={isDragging ? 'opacity-50' : 'opacity-100'}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <FormElementButton className="cursor-grab" {...props} />
    </li>
  );
}
