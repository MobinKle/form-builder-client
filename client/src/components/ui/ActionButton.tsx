import type { ReactNode } from 'react';

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  color?: 'emerald' | 'blue' | 'red';
  onClick?: () => void;
};

const colorClasses = {
  emerald: 'text-emerald-600 hover:text-emerald-700',
  blue: 'text-blue-600 hover:text-blue-700',
  red: 'text-red-500 hover:text-red-600',
};

export default function ActionButton({
  label,
  icon,
  color = 'blue',
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 transition-colors ${colorClasses[color]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
