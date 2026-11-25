export type ColorThemeId = 'teal' | 'violet' | 'ocean' | 'amber' | 'rose';

export interface ThemeConfig {
  id: ColorThemeId;
  label: string;
  swatch: string;
  activeNav: string;
  activeSubNav: string;
  badge: string;
  chevronActive: string;
  focusRing: string;
  brandHeaderGlow: string;
  logoAura: string;
  logoShadow: string;
  brandTextAura: string;
  brandText: string;
}

export const COLOR_THEMES: Record<ColorThemeId, ThemeConfig> = {
  teal: {
    id: 'teal',
    label: 'Teal',
    swatch: 'bg-teal-500',
    activeNav:
      'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold',
    activeSubNav: 'bg-teal-600 text-white shadow-xs',
    badge: 'bg-teal-600 text-white',
    chevronActive: 'text-teal-600 dark:text-teal-400',
    focusRing: 'focus:ring-teal-500',
    brandHeaderGlow: 'from-teal-500/20 via-emerald-500/15 to-transparent',
    logoAura: 'from-teal-400 via-emerald-400 to-teal-600',
    logoShadow: 'shadow-[0_0_16px_-2px_rgba(20,184,166,0.55)]',
    brandTextAura: 'from-teal-500/20 to-emerald-500/10',
    brandText: 'from-teal-600 via-emerald-500 to-teal-500 dark:from-teal-300 dark:via-emerald-300 dark:to-teal-400',
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    swatch: 'bg-violet-500',
    activeNav:
      'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 font-semibold',
    activeSubNav: 'bg-violet-600 text-white shadow-xs',
    badge: 'bg-violet-600 text-white',
    chevronActive: 'text-violet-600 dark:text-violet-400',
    focusRing: 'focus:ring-violet-500',
    brandHeaderGlow: 'from-violet-500/20 via-purple-500/15 to-transparent',
    logoAura: 'from-violet-400 via-purple-400 to-indigo-600',
    logoShadow: 'shadow-[0_0_16px_-2px_rgba(139,92,246,0.55)]',
    brandTextAura: 'from-violet-500/20 to-purple-500/10',
    brandText: 'from-violet-600 via-purple-500 to-indigo-500 dark:from-violet-300 dark:via-purple-300 dark:to-indigo-300',
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    swatch: 'bg-sky-500',
    activeNav:
      'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-semibold',
    activeSubNav: 'bg-sky-600 text-white shadow-xs',
    badge: 'bg-sky-600 text-white',
    chevronActive: 'text-sky-600 dark:text-sky-400',
    focusRing: 'focus:ring-sky-500',
    brandHeaderGlow: 'from-sky-500/20 via-blue-500/15 to-transparent',
    logoAura: 'from-sky-400 via-blue-400 to-indigo-600',
    logoShadow: 'shadow-[0_0_16px_-2px_rgba(14,165,233,0.55)]',
    brandTextAura: 'from-sky-500/20 to-blue-500/10',
    brandText: 'from-sky-600 via-blue-500 to-indigo-500 dark:from-sky-300 dark:via-blue-300 dark:to-indigo-300',
  },
  amber: {
    id: 'amber',
    label: 'Amber',
    swatch: 'bg-amber-500',
    activeNav:
      'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold',
    activeSubNav: 'bg-amber-600 text-white shadow-xs',
    badge: 'bg-amber-600 text-white',
    chevronActive: 'text-amber-600 dark:text-amber-400',
    focusRing: 'focus:ring-amber-500',
    brandHeaderGlow: 'from-amber-500/20 via-orange-500/15 to-transparent',
    logoAura: 'from-amber-400 via-orange-400 to-amber-600',
    logoShadow: 'shadow-[0_0_16px_-2px_rgba(245,158,11,0.55)]',
    brandTextAura: 'from-amber-500/20 to-orange-500/10',
    brandText: 'from-amber-600 via-orange-500 to-amber-500 dark:from-amber-300 dark:via-orange-300 dark:to-amber-400',
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    swatch: 'bg-rose-500',
    activeNav:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold',
    activeSubNav: 'bg-rose-600 text-white shadow-xs',
    badge: 'bg-rose-600 text-white',
    chevronActive: 'text-rose-600 dark:text-rose-400',
    focusRing: 'focus:ring-rose-500',
    brandHeaderGlow: 'from-rose-500/20 via-pink-500/15 to-transparent',
    logoAura: 'from-rose-400 via-pink-400 to-rose-600',
    logoShadow: 'shadow-[0_0_16px_-2px_rgba(244,63,94,0.55)]',
    brandTextAura: 'from-rose-500/20 to-pink-500/10',
    brandText: 'from-rose-600 via-pink-500 to-rose-500 dark:from-rose-300 dark:via-pink-300 dark:to-rose-400',
  },
};

export const THEME_LIST: ThemeConfig[] = [
  COLOR_THEMES.teal,
  COLOR_THEMES.violet,
  COLOR_THEMES.ocean,
  COLOR_THEMES.amber,
  COLOR_THEMES.rose,
];