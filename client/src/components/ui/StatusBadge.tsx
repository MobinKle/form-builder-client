type StatusBadgeProps = {
  active: boolean;
  draft: boolean;
  activeText: string;
  inactiveText: string;
  draftText: string;
};

export default function StatusBadge({
  active,
  draft,
  activeText,
  inactiveText,
  draftText,
}: StatusBadgeProps) {
  const label = draft ? draftText : active ? activeText : inactiveText;

  const colorClass = draft
    ? 'bg-amber-100 text-amber-700'
    : active
      ? 'bg-green-100 text-green-700'
      : 'bg-slate-100 text-slate-500';

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
