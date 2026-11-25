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
    activeNav: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
    activeSubNav: 'bg-teal-600 text-white shadow-sm',
    badge: 'bg-teal-600 text-white',
    chevronActive: 'text-teal-600 dark:text-teal-400',
    focusRing: 'focus:ring-teal-500',
    brandHeaderGlow: 'from-violet-500/20 via-teal-400/20 to-emerald-400/15',
    logoAura: 'from-violet-600/45 via-indigo-500/35 to-teal-400/45',
    logoShadow: 'shadow-[0_0_18px_-2px_rgba(20,184,166,0.5)]',
    brandTextAura: 'from-teal-400/25 via-emerald-400/20 to-violet-500/25',
    brandText:
      'from-slate-900 via-teal-800 to-indigo-900 dark:from-white dark:via-teal-100 dark:to-indigo-200 drop-shadow-[0_0_10px_rgba(20,184,166,0.28)] dark:drop-shadow-[0_0_14px_rgba(45,212,191,0.55)]',
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    swatch: 'bg-violet-500',
    activeNav: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300',
    activeSubNav: 'bg-violet-600 text-white shadow-sm',
    badge: 'bg-violet-600 text-white',
    chevronActive: 'text-violet-600 dark:text-violet-400',
    focusRing: 'focus:ring-violet-500',
    brandHeaderGlow: 'from-fuchsia-500/20 via-violet-500/20 to-indigo-400/15',
    logoAura: 'from-fuchsia-600/45 via-violet-500/40 to-indigo-500/45',
    logoShadow: 'shadow-[0_0_18px_-2px_rgba(139,92,246,0.55)]',
    brandTextAura: 'from-violet-500/25 via-fuchsia-400/20 to-indigo-500/25',
    brandText:
      'from-slate-900 via-violet-800 to-fuchsia-900 dark:from-white dark:via-violet-200 dark:to-fuchsia-200 drop-shadow-[0_0_10px_rgba(139,92,246,0.28)] dark:drop-shadow-[0_0_14px_rgba(167,139,250,0.55)]',
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    swatch: 'bg-sky-500',
    activeNav: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
    activeSubNav: 'bg-sky-600 text-white shadow-sm',
    badge: 'bg-sky-600 text-white',
    chevronActive: 'text-sky-600 dark:text-sky-400',
    focusRing: 'focus:ring-sky-500',
    brandHeaderGlow: 'from-blue-500/20 via-sky-400/20 to-cyan-400/15',
    logoAura: 'from-blue-600/45 via-sky-500/40 to-cyan-400/45',
    logoShadow: 'shadow-[0_0_18px_-2px_rgba(14,165,233,0.5)]',
    brandTextAura: 'from-sky-400/25 via-cyan-400/20 to-blue-500/25',
    brandText:
      'from-slate-900 via-sky-800 to-blue-900 dark:from-white dark:via-sky-200 dark:to-cyan-200 drop-shadow-[0_0_10px_rgba(14,165,233,0.28)] dark:drop-shadow-[0_0_14px_rgba(56,189,248,0.55)]',
  },
  amber: {
    id: 'amber',
    label: 'Amber',
    swatch: 'bg-amber-500',
    activeNav: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
    activeSubNav: 'bg-amber-600 text-white shadow-sm',
    badge: 'bg-amber-600 text-white',
    chevronActive: 'text-amber-600 dark:text-amber-400',
    focusRing: 'focus:ring-amber-500',
    brandHeaderGlow: 'from-orange-500/20 via-amber-400/20 to-yellow-400/15',
    logoAura: 'from-orange-500/45 via-amber-500/40 to-yellow-400/45',
    logoShadow: 'shadow-[0_0_18px_-2px_rgba(245,158,11,0.5)]',
    brandTextAura: 'from-amber-400/25 via-orange-400/20 to-yellow-400/25',
    brandText:
      'from-slate-900 via-amber-800 to-orange-900 dark:from-white dark:via-amber-200 dark:to-orange-200 drop-shadow-[0_0_10px_rgba(245,158,11,0.28)] dark:drop-shadow-[0_0_14px_rgba(251,191,36,0.5)]',
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    swatch: 'bg-rose-500',
    activeNav: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
    activeSubNav: 'bg-rose-600 text-white shadow-sm',
    badge: 'bg-rose-600 text-white',
    chevronActive: 'text-rose-600 dark:text-rose-400',
    focusRing: 'focus:ring-rose-500',
    brandHeaderGlow: 'from-pink-500/20 via-rose-400/20 to-orange-400/15',
    logoAura: 'from-pink-600/45 via-rose-500/40 to-fuchsia-500/45',
    logoShadow: 'shadow-[0_0_18px_-2px_rgba(244,63,94,0.5)]',
    brandTextAura: 'from-rose-400/25 via-pink-400/20 to-fuchsia-500/25',
    brandText:
      'from-slate-900 via-rose-800 to-pink-900 dark:from-white dark:via-rose-200 dark:to-pink-200 drop-shadow-[0_0_10px_rgba(244,63,94,0.28)] dark:drop-shadow-[0_0_14px_rgba(251,113,133,0.55)]',
  },
};

export const THEME_LIST = Object.values(COLOR_THEMES);