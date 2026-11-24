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
        'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
  if (diffHours < 24)
    return {
      label: `In ${Math.max(1, diffHours)}h`,
      style:
        'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    };
  if (diffDays === 1)
    return {
      label: 'Tomorrow',
      style:
        'bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    };
  if (diffDays <= 4)
    return {
      label: `In ${diffDays} days`,
      style:
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    };
  return {
    label: `In ${diffDays} days`,
    style:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };
};

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'Quiz':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300';
    case 'Assignment':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300';
    case 'Midterm':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300';
    case 'Final':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};