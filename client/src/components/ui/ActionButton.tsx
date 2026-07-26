import type { ReactNode } from 'react';

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  disabled?: boolean;
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
  disabled = false,
  color = 'blue',
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={[
        'flex items-center gap-1.5 transition-colors',
        disabled
          ? 'cursor-not-allowed text-slate-400 opacity-60'
          : `cursor-pointer ${colorClasses[color]}`,
      ].join(' ')}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
