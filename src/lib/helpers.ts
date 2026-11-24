export const formatTime12Hour = (time24: string) => {
  if (!time24) return '';
  const [hoursStr, minutes] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const getCountdownBadge = (isoDate: string) => {
  const now = new Date();
  const target = new Date(isoDate);
  const diffMs = target.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0)
    return {
      label: 'Overdue',
      style:
        'bg-rose-500/12 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    };
  if (diffHours < 24)
    return {
      label: `In ${Math.max(1, diffHours)}h`,
      style:
        'bg-amber-500/15 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border-amber-500/35 shadow-[0_0_14px_rgba(245,158,11,0.18)]',
    };
  if (diffDays === 1)
    return {
      label: 'Tomorrow',
      style:
        'bg-orange-500/12 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300 border-orange-500/30',
    };
  if (diffDays <= 4)
    return {
      label: `In ${diffDays} days`,
      style:
        'bg-teal-500/12 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300 border-teal-500/30',
    };
  return {
    label: `In ${diffDays} days`,
    style:
      'bg-stone-200/70 text-stone-700 dark:bg-white/[0.06] dark:text-zinc-300 border-stone-300/80 dark:border-white/10',
  };
};

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'Quiz':
      return 'bg-cyan-500/12 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300 border border-cyan-500/25';
    case 'Assignment':
      return 'bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border border-emerald-500/25';
    case 'Midterm':
      return 'bg-amber-500/14 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300 border border-amber-500/30';
    case 'Final':
      return 'bg-rose-500/12 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300 border border-rose-500/25';
    default:
      return 'bg-stone-200/70 text-stone-700 dark:bg-white/[0.08] dark:text-zinc-300';
  }
};