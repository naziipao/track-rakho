'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  Clock,
  FileCheck2,
  ClipboardList,
  BookOpenCheck,
  GraduationCap,
  UserCheck,
  StickyNote,
  Library,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Palette,
  Check,
} from 'lucide-react';
import { AssessmentCategory, TabId } from '@/lib/types';
import { COLOR_THEMES, ColorThemeId, THEME_LIST, ThemeConfig } from '@/lib/themes';

export type CategorizedAssessmentType = 'Assignment' | 'Midterm' | 'Final';

const THEME_STORAGE_KEY = 'track-rakho-theme';
const THEME_EVENT_NAME = 'track-rakho-theme-change';

function useSyncedColorTheme(
  controlledTheme?: ColorThemeId,
  onSelectControlled?: (theme: ColorThemeId) => void
): [ColorThemeId, (theme: ColorThemeId) => void] {
  const [internalTheme, setInternalTheme] = useState<ColorThemeId>('teal');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ColorThemeId | null;
      if (saved && saved in COLOR_THEMES) {
        setInternalTheme(saved);
      }
    } catch {
      // Ignore storage access errors
    }

    const handleThemeEvent = (e: Event) => {
      const next = (e as CustomEvent<ColorThemeId>).detail;
      if (next && next in COLOR_THEMES) {
        setInternalTheme(next);
      }
    };

    window.addEventListener(THEME_EVENT_NAME, handleThemeEvent);
    return () => window.removeEventListener(THEME_EVENT_NAME, handleThemeEvent);
  }, []);

  const activeTheme = controlledTheme ?? internalTheme;

  const selectTheme = (next: ColorThemeId) => {
    setInternalTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors
    }
    window.dispatchEvent(new CustomEvent<ColorThemeId>(THEME_EVENT_NAME, { detail: next }));
    onSelectControlled?.(next);
  };

  return [activeTheme, selectTheme];
}

interface PendingCounts {
  Quiz: number;
  Assignment: number;
  Midterm: number;
  Final: number;
}

interface SubCounts {
  Assignment: { Theory: number; Lab: number };
  Midterm: { Theory: number; Lab: number };
  Final: { Theory: number; Lab: number };
}

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  colorTheme?: ColorThemeId;
  onSelectColorTheme?: (theme: ColorThemeId) => void;
  onLogout: () => void;
  pendingCounts: PendingCounts;
  subCounts: SubCounts;
}

interface MobileHeaderProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  uniqueSemesters: string[];
  activeSemester: string;
  onSelectActiveSemester: (sem: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  colorTheme?: ColorThemeId;
  onSelectColorTheme?: (theme: ColorThemeId) => void;
  onLogout: () => void;
  pendingCounts: PendingCounts;
  subCounts: SubCounts;
}

interface MobileBottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  pendingCounts: PendingCounts;
  colorTheme?: ColorThemeId;
  categoryFilters?: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment?: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  subCounts?: SubCounts;
}

const NAV_ITEMS: {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: keyof PendingCounts;
  categorized?: CategorizedAssessmentType;
}[] = [
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'routine', label: 'Routine', icon: Clock },
  { id: 'Quiz', label: 'Quiz', icon: FileCheck2, countKey: 'Quiz' },
  {
    id: 'Assignment',
    label: 'Assignment',
    icon: ClipboardList,
    countKey: 'Assignment',
    categorized: 'Assignment',
  },
  {
    id: 'Midterm',
    label: 'Midterm',
    icon: BookOpenCheck,
    countKey: 'Midterm',
    categorized: 'Midterm',
  },
  {
    id: 'Final',
    label: 'Final',
    icon: GraduationCap,
    countKey: 'Final',
    categorized: 'Final',
  },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'courses', label: 'Courses', icon: Library },
];

// --- COMPACT BOUNCING THEME PICKER ---
function ThemePicker({
  colorTheme,
  onSelectColorTheme,
  align = 'up',
}: {
  colorTheme: ColorThemeId;
  onSelectColorTheme: (theme: ColorThemeId) => void;
  align?: 'up' | 'down';
}) {
  const [open, setOpen] = useState(false);
  const [bumping, setBumping] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bumping) return;
    const t = setTimeout(() => setBumping(false), 220);
    return () => clearTimeout(t);
  }, [bumping]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          setBumping(false);
          requestAnimationFrame(() => setBumping(true));
          setOpen((prev) => !prev);
        }}
        aria-label="Select color theme"
        className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 ${
          bumping ? '-translate-y-0.5 scale-105' : 'translate-y-0 scale-100'
        }`}
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-44 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl ${
            align === 'up' ? 'bottom-12' : 'top-11'
          }`}
        >
          <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Color Theme
          </p>
          <div className="space-y-1">
            {THEME_LIST.map((t) => {
              const selected = colorTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onSelectColorTheme(t.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-transform duration-150 active:scale-95 ${
                    selected
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full ${t.swatch} ring-2 ring-white dark:ring-slate-900 shadow-xs`}
                    />
                    <span>{t.label}</span>
                  </span>
                  {selected && (
                    <Check className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SHARED NAV LIST WITH COLLAPSIBLE DROPDOWNS ---
function NavMenuList({
  activeTab,
  setActiveTab,
  categoryFilters,
  onSelectCategorizedAssessment,
  pendingCounts,
  subCounts,
  theme,
  onItemSelect,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  categoryFilters: Record<CategorizedAssessmentType, AssessmentCategory>;
  onSelectCategorizedAssessment: (
    type: CategorizedAssessmentType,
    category: AssessmentCategory
  ) => void;
  pendingCounts: PendingCounts;
  subCounts: SubCounts;
  theme: ThemeConfig;
  onItemSelect?: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<CategorizedAssessmentType, boolean>>({
    Assignment: activeTab === 'Assignment',
    Midterm: activeTab === 'Midterm',
    Final: activeTab === 'Final',
  });
  const [bumpedKey, setBumpedKey] = useState<string | null>(null);

  const triggerBump = (key: string) => {
    setBumpedKey(null);
    requestAnimationFrame(() => {
      setBumpedKey(key);
    });
  };

  useEffect(() => {
    if (!bumpedKey) return;
    const timer = setTimeout(() => setBumpedKey(null), 220);
    return () => clearTimeout(timer);
  }, [bumpedKey]);

  useEffect(() => {
    if (activeTab === 'Assignment' || activeTab === 'Midterm' || activeTab === 'Final') {
      setExpanded((prev) => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab]);

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        const badge = item.countKey ? pendingCounts[item.countKey] : 0;
        const isDropdown = Boolean(item.categorized);
        const isOpen = item.categorized ? expanded[item.categorized] : false;
        const isBumped = bumpedKey === item.id;

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                triggerBump(item.id);
                if (item.categorized) {
                  setExpanded((prev) => ({
                    ...prev,
                    [item.categorized!]: !prev[item.categorized!],
                  }));
                } else {
                  setActiveTab(item.id);
                  onItemSelect?.();
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.96] ${
                isBumped ? 'translate-x-1.5 scale-[1.02]' : 'translate-x-0 scale-100'
              } ${
                isActive
                  ? theme.activeNav
                  : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isBumped ? 'scale-110' : 'scale-100'
                  }`}
                />
                <span>{item.label}</span>
              </span>

              <span className="flex items-center gap-1.5">
                {badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${theme.badge}`}
                  >
                    {badge}
                  </span>
                )}
                {isDropdown && (
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? `rotate-180 ${theme.chevronActive}` : ''
                    }`}
                  />
                )}
              </span>
            </button>

            {item.categorized && isOpen && (
              <div className="ml-5 mt-1 mb-1.5 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                {(['Theory', 'Lab'] as AssessmentCategory[]).map((cat) => {
                  const subKey = `${item.categorized}-${cat}`;
                  const subActive =
                    isActive && categoryFilters[item.categorized!] === cat;
                  const count = subCounts[item.categorized!][cat];
                  const isSubBumped = bumpedKey === subKey;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.blur();
                        triggerBump(subKey);
                        onSelectCategorizedAssessment(item.categorized!, cat);
                        onItemSelect?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.96] ${
                        isSubBumped
                          ? 'translate-x-1 scale-[1.02]'
                          : 'translate-x-0 scale-100'
                      } ${
                        subActive
                          ? theme.activeSubNav
                          : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          subActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// --- DESKTOP SIDEBAR ---
export function Sidebar({
  activeTab,
  setActiveTab,
  categoryFilters,
  onSelectCategorizedAssessment,
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
  colorTheme,
  onSelectColorTheme,
  onLogout,
  pendingCounts,
  subCounts,
}: SidebarProps) {
  const [resolvedTheme, handleSelectTheme] = useSyncedColorTheme(
    colorTheme,
    onSelectColorTheme
  );
  const theme = COLOR_THEMES[resolvedTheme];
  const [brandBouncing, setBrandBouncing] = useState(false);
  const [bumpedAction, setBumpedAction] = useState<'theme' | 'logout' | null>(null);

  const handleBrandPress = () => {
    setActiveTab('today');
    setBrandBouncing(false);
    requestAnimationFrame(() => {
      setBrandBouncing(true);
    });
  };

  const triggerActionBump = (action: 'theme' | 'logout') => {
    setBumpedAction(null);
    requestAnimationFrame(() => {
      setBumpedAction(action);
    });
  };

  useEffect(() => {
    if (!brandBouncing) return;
    const timer = setTimeout(() => setBrandBouncing(false), 260);
    return () => clearTimeout(timer);
  }, [brandBouncing]);

  useEffect(() => {
    if (!bumpedAction) return;
    const timer = setTimeout(() => setBumpedAction(null), 220);
    return () => clearTimeout(timer);
  }, [bumpedAction]);

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
      <div className="relative p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0 overflow-hidden">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -top-6 left-4 w-44 h-16 rounded-full bg-gradient-to-r ${theme.brandHeaderGlow} blur-2xl transition-colors duration-300`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            handleBrandPress();
          }}
          className={`group relative flex items-center gap-3 text-left select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 active:translate-y-0.5 ${
            brandBouncing ? '-translate-y-1.5 scale-105' : 'translate-y-0 scale-100'
          }`}
        >
          <div className="relative shrink-0">
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-tr ${theme.logoAura} blur-md opacity-80 group-hover:opacity-100 transition-all duration-300`}
            />
            <img
              src="/logo.svg?v=2"
              alt="Track Rakho"
              className={`relative w-9 h-9 rounded-xl object-cover ring-1 ring-white/40 dark:ring-white/20 ${theme.logoShadow} transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 group-active:scale-90 group-active:-rotate-6 ${
                brandBouncing ? 'rotate-6 scale-110' : ''
              }`}
            />
          </div>

          <div className="relative">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-x-1.5 -inset-y-0.5 rounded-lg bg-gradient-to-r ${theme.brandTextAura} blur-md opacity-75 group-hover:opacity-100 transition-all duration-300`}
            />
            <span
              className={`relative font-extrabold text-lg tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${theme.brandText}`}
            >
              Track Rakho
            </span>
          </div>
        </button>
      </div>

      <div className="px-4 pt-4 pb-2 shrink-0">
        <select
          value={activeSemester}
          onChange={(e) => onSelectActiveSemester(e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 ${theme.focusRing}`}
        >
          <option value="All">All Semesters</option>
          {uniqueSemesters.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      <NavMenuList
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categoryFilters={categoryFilters}
        onSelectCategorizedAssessment={onSelectCategorizedAssessment}
        pendingCounts={pendingCounts}
        subCounts={subCounts}
        theme={theme}
      />

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            triggerActionBump('theme');
            onToggleDarkMode();
          }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 ${
            bumpedAction === 'theme'
              ? '-translate-y-0.5 scale-[1.03]'
              : 'translate-y-0 scale-100'
          }`}
        >
          {darkMode ? (
            <Sun
              className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                bumpedAction === 'theme' ? 'scale-110 rotate-45' : 'scale-100 rotate-0'
              }`}
            />
          ) : (
            <Moon
              className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                bumpedAction === 'theme' ? 'scale-110 -rotate-12' : 'scale-100 rotate-0'
              }`}
            />
          )}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>

        <ThemePicker
          colorTheme={resolvedTheme}
          onSelectColorTheme={handleSelectTheme}
          align="up"
        />

        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            triggerActionBump('logout');
            onLogout();
          }}
          aria-label="Lock app"
          className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 ${
            bumpedAction === 'logout'
              ? '-translate-y-0.5 scale-105'
              : 'translate-y-0 scale-100'
          }`}
        >
          <LogOut
            className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              bumpedAction === 'logout' ? 'scale-110 translate-x-0.5' : 'scale-100'
            }`}
          />
        </button>
      </div>
    </aside>
  );
}

// --- MOBILE TOP HEADER + COLLAPSIBLE DRAWER MENU ---
export function MobileHeader({
  activeTab,
  setActiveTab,
  categoryFilters,
  onSelectCategorizedAssessment,
  uniqueSemesters,
  activeSemester,
  onSelectActiveSemester,
  darkMode,
  onToggleDarkMode,
  colorTheme,
  onSelectColorTheme,
  onLogout,
  pendingCounts,
  subCounts,
}: MobileHeaderProps) {
  const [resolvedTheme, handleSelectTheme] = useSyncedColorTheme(
    colorTheme,
    onSelectColorTheme
  );
  const theme = COLOR_THEMES[resolvedTheme];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brandBouncing, setBrandBouncing] = useState(false);
  const [bumpedAction, setBumpedAction] = useState<'theme' | 'logout' | null>(null);

  const handleBrandPress = () => {
    setActiveTab('today');
    setBrandBouncing(false);
    requestAnimationFrame(() => {
      setBrandBouncing(true);
    });
  };

  const triggerActionBump = (action: 'theme' | 'logout') => {
    setBumpedAction(null);
    requestAnimationFrame(() => {
      setBumpedAction(action);
    });
  };

  useEffect(() => {
    if (!brandBouncing) return;
    const timer = setTimeout(() => setBrandBouncing(false), 260);
    return () => clearTimeout(timer);
  }, [brandBouncing]);

  useEffect(() => {
    if (!bumpedAction) return;
    const timer = setTimeout(() => setBumpedAction(null), 220);
    return () => clearTimeout(timer);
  }, [bumpedAction]);

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                setDrawerOpen(true);
              }}
              aria-label="Open menu"
              className="p-2 -ml-1 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                handleBrandPress();
              }}
              className={`group relative flex items-center gap-2 shrink-0 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 active:translate-y-0.5 ${
                brandBouncing ? '-translate-y-1 scale-105' : 'translate-y-0 scale-100'
              }`}
            >
              <div className="relative shrink-0">
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -inset-0.5 rounded-xl bg-gradient-to-tr ${theme.logoAura} blur-sm opacity-80`}
                />
                <img
                  src="/logo.svg?v=2"
                  alt="Track Rakho"
                  className={`relative w-8 h-8 rounded-lg object-cover ring-1 ring-white/40 dark:ring-white/20 ${theme.logoShadow} transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 group-active:-rotate-6 ${
                    brandBouncing ? 'rotate-6 scale-110' : ''
                  }`}
                />
              </div>
              <span
                className={`font-extrabold text-sm tracking-tight whitespace-nowrap bg-gradient-to-r bg-clip-text text-transparent ${theme.brandText}`}
              >
                Track Rakho
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <select
              value={activeSemester}
              onChange={(e) => onSelectActiveSemester(e.target.value)}
              className="max-w-[96px] truncate px-2 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
            >
              <option value="All">All Sem</option>
              {uniqueSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>

            <ThemePicker
              colorTheme={resolvedTheme}
              onSelectColorTheme={handleSelectTheme}
              align="down"
            />

            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                triggerActionBump('theme');
                onToggleDarkMode();
              }}
              aria-label="Toggle dark mode"
              className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 ${
                bumpedAction === 'theme'
                  ? '-translate-y-0.5 scale-105'
                  : 'translate-y-0 scale-100'
              }`}
            >
              {darkMode ? (
                <Sun
                  className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    bumpedAction === 'theme' ? 'scale-110 rotate-45' : 'scale-100 rotate-0'
                  }`}
                />
              ) : (
                <Moon
                  className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    bumpedAction === 'theme' ? 'scale-110 -rotate-12' : 'scale-100 rotate-0'
                  }`}
                />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                triggerActionBump('logout');
                onLogout();
              }}
              aria-label="Lock app"
              className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 shrink-0 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 ${
                bumpedAction === 'logout'
                  ? '-translate-y-0.5 scale-105'
                  : 'translate-y-0 scale-100'
              }`}
            >
              <LogOut
                className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  bumpedAction === 'logout' ? 'scale-110 translate-x-0.5' : 'scale-100'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Collapsible Slide-Over Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10">
            <div className="relative p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-hidden">
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -top-5 left-3 w-40 h-14 rounded-full bg-gradient-to-r ${theme.brandHeaderGlow} blur-xl`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.blur();
                  handleBrandPress();
                  setDrawerOpen(false);
                }}
                className={`group relative flex items-center gap-2.5 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90 active:translate-y-0.5 ${
                  brandBouncing ? '-translate-y-1 scale-105' : 'translate-y-0 scale-100'
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -inset-0.5 rounded-xl bg-gradient-to-tr ${theme.logoAura} blur-sm opacity-80`}
                  />
                  <img
                    src="/logo.svg?v=2"
                    alt="Track Rakho"
                    className={`relative w-8 h-8 rounded-lg object-cover ring-1 ring-white/40 dark:ring-white/20 ${theme.logoShadow} transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 group-active:-rotate-6 ${
                      brandBouncing ? 'rotate-6 scale-110' : ''
                    }`}
                  />
                </div>
                <span
                  className={`font-extrabold text-base tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${theme.brandText}`}
                >
                  Track Rakho
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-transform duration-200 active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <NavMenuList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              categoryFilters={categoryFilters}
              onSelectCategorizedAssessment={onSelectCategorizedAssessment}
              pendingCounts={pendingCounts}
              subCounts={subCounts}
              theme={theme}
              onItemSelect={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

// --- MOBILE BOTTOM NAV + ON-DEMAND SUB-MENU BAR ---
export function MobileBottomNav({
  activeTab,
  setActiveTab,
  pendingCounts,
  colorTheme,
  categoryFilters,
  onSelectCategorizedAssessment,
  subCounts,
}: MobileBottomNavProps) {
  const [resolvedTheme] = useSyncedColorTheme(colorTheme);
  const theme = COLOR_THEMES[resolvedTheme];
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<CategorizedAssessmentType | null>(null);
  const [bumpedKey, setBumpedKey] = useState<string | null>(null);

  const triggerBump = (key: string) => {
    setBumpedKey(null);
    requestAnimationFrame(() => {
      setBumpedKey(key);
    });
  };

  useEffect(() => {
    if (!bumpedKey) return;
    const timer = setTimeout(() => setBumpedKey(null), 220);
    return () => clearTimeout(timer);
  }, [bumpedKey]);

  useEffect(() => {
    if (activeTab !== 'Assignment' && activeTab !== 'Midterm' && activeTab !== 'Final') {
      setOpenSubMenu(null);
    }
    activeBtnRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeTab]);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      {/* Mobile Sub-Menu — opens for the active Assignment / Midterm / Final tab */}
      {openSubMenu &&
        activeTab === openSubMenu &&
        categoryFilters &&
        onSelectCategorizedAssessment && (
          <div className="px-3 py-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pl-1 shrink-0">
              {openSubMenu}:
            </span>
            <div className="flex-1 flex items-center justify-center gap-2">
              {(['Theory', 'Lab'] as AssessmentCategory[]).map((cat) => {
                const subKey = `${openSubMenu}-${cat}`;
                const isSelected = categoryFilters[openSubMenu] === cat;
                const count = subCounts?.[openSubMenu]?.[cat];
                const isSubBumped = bumpedKey === subKey;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      triggerBump(subKey);
                      onSelectCategorizedAssessment(openSubMenu, cat);
                      setOpenSubMenu(null);
                    }}
                    className={`flex-1 max-w-[130px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 ${
                      isSubBumped
                        ? '-translate-y-0.5 scale-[1.03]'
                        : 'translate-y-0 scale-100'
                    } ${
                      isSelected
                        ? theme.activeSubNav
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {typeof count === 'number' && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setOpenSubMenu(null)}
              aria-label="Close sub-menu"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 [-webkit-tap-highlight-color:transparent] focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      {/* Horizontally Scrollable Bottom Tabs */}
      <div
        className="flex items-center overflow-x-auto touch-pan-x scroll-smooth px-2 py-1.5 gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = item.countKey ? pendingCounts[item.countKey] : 0;
          const isBumped = bumpedKey === item.id;

          return (
            <button
              key={item.id}
              ref={isActive ? activeBtnRef : null}
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                triggerBump(item.id);
                if (item.categorized) {
                  setActiveTab(item.id);
                  setOpenSubMenu((prev) =>
                    prev === item.categorized ? null : item.categorized!
                  );
                } else {
                  setOpenSubMenu(null);
                  setActiveTab(item.id);
                }
              }}
              className={`relative shrink-0 min-w-[68px] flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl select-none cursor-pointer [-webkit-tap-highlight-color:transparent] focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-95 ${
                isBumped ? '-translate-y-1 scale-[1.04]' : 'translate-y-0 scale-100'
              } ${
                isActive
                  ? theme.activeNav
                  : 'bg-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isBumped ? 'scale-110' : 'scale-100'
                  }`}
                />
                {badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full ${theme.badge}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}